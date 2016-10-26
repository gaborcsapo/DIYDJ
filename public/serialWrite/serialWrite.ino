// remote controller
#define IR_BIT_LENGTH 32    // number of bits sent by IR remote
#define FirstLastBit 15     // divide 32 bits into two 15 bit chunks for integer variables. Ignore center two bits. they are all the same.
#define BIT_1 1500          // Binary 1 threshold (Microseconds)
#define BIT_0 450           // Binary 0 threshold (Microseconds)
#define BIT_START 4000      // Start bit threshold (Microseconds)
#define IR_PIN 4            // IR Sensor pin
#define LED_PIN 13          // LED goes off when signal is received

int debug = 0;              // flag as 1 to output raw IR pulse data stream length in microseconds
int output_verify = 0;      // flag as 1 to print decoded verification integers. same number for all buttons
int output_key = 0;         // flag as 1 to print decoded key integers
int remote_verify = 16128;  // verifies first bits are 11111100000000 different remotes may have different start codes

//reversion button
int buttonPressed = 0; 
int buttonState = 0;
bool pressed = false;
int key;

void setup() {
  Serial.begin(9600); // Start serial communication at 9600 bps
  pinMode(7, INPUT);
  pinMode(IR_PIN, INPUT);
}

void loop() {
  
  key = get_ir_key();
  do_response(key);
  Serial.print(",");
  Serial.print(analogRead(A0));
  Serial.print(",");
  Serial.print(analogRead(A1));
  Serial.print(",");
  buttonPressed = digitalRead(2);
  if (buttonPressed == LOW){
    if (!pressed)
      buttonState += 1;
    pressed = true;
  } else
    pressed = false;
  Serial.print(buttonState%2);   
  Serial.println();
  delay(100);                            // Wait 100 milliseconds
}



/*
  wait for a keypress from the IR remote, and return the
  integer mapping of that key (e.g. power button on remote returns 
  the integer 1429)
*/

int get_ir_key() 
{
  
  int pulse[IR_BIT_LENGTH];
  int bits[IR_BIT_LENGTH];

  do {
    Serial.print("null,");
    Serial.print(analogRead(A0));
    Serial.print(",");
    Serial.print(analogRead(A1));
    Serial.print(",");
    buttonPressed = digitalRead(2);
    if (buttonPressed == LOW){
      if (!pressed)
        buttonState += 1;
      pressed = true;
    } else
      pressed = false;
    Serial.print(buttonState%2);   
    Serial.println();
    delay(50); 
  } //Wait for a start bit
  while(pulseIn(IR_PIN, HIGH) < BIT_START);
  
  read_pulse(pulse);
  pulse_to_bits(pulse, bits);
  RemoteVerify(bits);
  return bits_to_int(bits);
}


/*
  use pulseIn to receive IR pulses from the remote.
  Record the length of these pulses (in ms) in an array
*/
void read_pulse(int pulse[]){
  for (int i = 0; i < IR_BIT_LENGTH; i++){
    pulse[i] = pulseIn(IR_PIN, HIGH);
  }
}

/*
  IR pulses encode binary "0" as a short pulse, and binary "1"
  as a long pulse.  Given an array containing pulse lengths,
  convert this to an array containing binary values
*/
void pulse_to_bits(int pulse[], int bits[]){
  if (debug) { Serial.println("-----"); }
  for(int i = 0; i < IR_BIT_LENGTH; i++){
    if (debug) { Serial.println(pulse[i]); }
    if(pulse[i] > BIT_1){
      bits[i] = 1;
    }else if(pulse[i] > BIT_0){
      bits[i] = 0;
    }  else {
      Serial.println("Error");
    }
  }
}

/*
  check returns proper first 14 check bits
*/
void RemoteVerify(int bits[]){
  int result = 0;
  int seed = 1;
  
  //Convert bits to integer
  for(int i = 0 ; i < (FirstLastBit) ; i++) {      
    if(bits[i] == 1) 
    {
  result += seed;
    }
    
    seed *= 2;
  }
        if (output_verify)
      {
        Serial.print("Remote ");
        Serial.print(result);
        Serial.println(" verification code");
      }
 if (remote_verify != result) {delay (60); get_ir_key();} //verify first group of bits. delay for data stream to end, then try again.
}


/*
  convert an array of binary values to a single base-10 integer
*/

int bits_to_int(int bits[]){
  int result = 0;
  int seed = 1;
  
  //Convert bits to integer
  for(int i = (IR_BIT_LENGTH-FirstLastBit) ; i < IR_BIT_LENGTH ; i++){     
    if(bits[i] == 1) 
    {
  result += seed;
    }   
    seed *= 2;
  }
  return result;
}


/* 
  respond to specific remote-control keys with different behaviors
*/

void do_response(int key)
{  
  
  if (output_key)
   {
      Serial.print("Key ");
      Serial.println(key);
   }
  
  switch (key)
  {
    case 32640:  // turns on UUT power
      Serial.print("null");
      break;

    case 32385:  // FUNC/STOP turns off UUT power
      Serial.print("null");
      break;

    case 32130:  // |<< ReTest failed Test
      Serial.print("a");
      break;

    case 32002:  // >|| Test
      Serial.print("b");
      break;

    case 31875:  // >>| perform selected test number
      Serial.print("c");
      break;

    case 32512:  // VOL+ turns on individual test beeper
      Serial.print("null");
      break;

    case 31492:  // VOL- turns off individual test beeper
      Serial.print("null");
      break;

    case 31620:  // v scroll down tests
      Serial.print("null");
      break;

    case 31365:  // ^ scroll up tests
      Serial.print("null");
      break;

    case 30982:  // EQ negative tests internal setup
     Serial.print("null");
      break;

    case 30855:  // ST/REPT Positive tests Select Test and Repeat Test
      Serial.print("null");
      break;

    case 31110:  // 0
      Serial.print("null");
      break;

    case 30600:  // 1
      Serial.print("1");
      break;

    case 30472:  // 2
      Serial.print("2");
      break;

    case 30345:  // 3
      Serial.print("3");
      break;

    case 30090:  // 4
      Serial.print("4");
      break;

    case 29962:  // 5
      Serial.print("5");
      break;

    case 29835:  // 6
      Serial.print("6");
      break;

    case 29580:  // 7
      Serial.print("null");
      break;

    case 29452:  // 8
      Serial.print("null");
      break;

    case 29325:  // 9
      Serial.print("null");
      break;
     
    default:
      {
//        Serial.print("Key ");
//        Serial.print(key);
//        Serial.println(" not programmed");
          Serial.print("null");
          break;
      }
    break;
  }
}
