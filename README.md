<h1 style="text-align: center;">DIYDJ 2.0</h1>
<p style="text-align: center;"><span style="font-weight: 400;">Gabor Csapo - Interaction Lab - Fall 2016 NYUSH</span></p>
<span style="font-weight: 400;">DIYDJ is a human computer interaction experiment, where the user interacts with a website through 3 separate interfaces to twist songs in fun ways. </span>
<h5 style="text-align: center;"><a href="http://diydj.herokuapp.com">Click here to go to the Website!!</a></h5>
<!--more-->
<h1><span style="font-weight: 400;">The project is made up of three parts:</span></h1>
<ul>
 	<li style="font-weight: 400;"><span style="font-weight: 400;">The website grabs and plays songs from Soundcloud, using Tone JS manipulates them, using P5.dom tracks colors, which is used as one of the inputs for the sound manipulation, using P5.speech recognizes if the user says “reverse” and reverses the song. I spent a significant amount of time on designing a pretty interface.</span></li>
 	<li style="font-weight: 400;"><span style="font-weight: 400;">The arduino yun controller is a box with a battery that sends signal over wifi to the server to change the sound being played on the website</span></li>
 	<li style="font-weight: 400;"><span style="font-weight: 400;">The server is set up using Node JS, hosted on Heroku, so it is publically available.</span></li>
</ul>
<a href="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205228/20161212_0058051.jpg"><img class="alignnone size-medium wp-image-71680" src="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205228/20161212_0058051-300x169.jpg" alt="20161212_005805" width="300" height="169" /></a>
<h1><span style="font-weight: 400;">Ideation</span></h1>
<span style="font-weight: 400;">The project is inspired by my midterm project but it is upgraded in every sense. In the midterm project I was looking for fun ways to manipulate sound, which turned out to be harder than I thought. I consulted with Luisa and in the end we agreed that playbackrate, pitch and filters are the best ways that are still manageably hard. This time I wanted to create fun interfaces to manipulate the sound with. I was thinking a lot about meaningful, fun and novel interfaces and I concluded computer vision, speech recognition and a wifi enabled controller is the best.</span>
<h1>Research and Development</h1>
<span style="font-weight: 400;">I started my research with looking up technologies that are capable of achieving my goal. Last time I made the mistake of spending too much time on the wrong library. I didn’t want to make the same mistake. I’m still using Soundcloud as my source of songs, the layout is achieved using Bootstrap, Jquery. The server is built using Node JS and is connected to the website using Socket IO. The new technologies are:</span>
<ul>
<ul>
 	<li style="font-weight: 400;"><span style="font-weight: 400;">P5 (Processing part): My original plan was to use the OpenCV Processing library to capture and use facial expressions as input for the website. However, I realised that it would create a cluttered platform with a website that is publicly available but only working with a program that one has to download, which didn’t make sense to me. Since the class is all about meaningful interactions between humans, the physical and the digital world, I thought it would be great to take a step forward from computer programming to web programming so that I can easily share my creation with others. I did sketches in Processing and they worked fine, but for the above mentioned reasons I decided to switch to the web version of Processing, P5 JS. It is technically the same thing as Processing, so as I discussed with Prof. Moon, it fulfills the processing part of the final assignment. I’m using P5.dom for capturing video and color tracking and P5.speech (created by NYU) for speech recognition. They are fairly straight forward libraries, so I only had to fix some minor bugs. Although the speech recognition doesn’t produce the best results. With the color tracking the biggest problem was that objects change their colors in different light scenarios. As a solution I included a control panel, where one can dynamically set the color being tracked. </span></li>
</ul>
</ul>
<ul>
 	<li style="font-weight: 400;"><span style="font-weight: 400;"> Arduino Yun: I wanted to create something more technical for the arduino part than what I had before. Creating a battery powered Wifi enabled Arduino sounded like a good challenge and a useful skill since in the real world we would never connect an embedded device to a computer. I built a simple cardboard box for the parts to make it less messy. I big lesson I learnt is to learn to read emails, because I didn’t know the laser cutting is shut down after Dec. 7. And I made an appointment for Dec. 9 so even though I made a crazy cool box with an interesting pattern, I couldn’t laser cut it...<a href="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205321/20161214_2349551.jpg"><img class="size-medium wp-image-71682 alignright" src="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205321/20161214_2349551-300x169.jpg" alt="20161214_234955" width="300" height="169" /></a></span></li>
</ul>
<h1 style="text-align: center;"></h1>
[video width="1920" height="1080" mp4="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205502/20161214_235250.mp4"][/video]

[video width="1920" height="1080" mp4="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205725/20161214_235441.mp4"][/video]
<h1 style="text-align: center;"></h1>
<h4 style="text-align: center;"><a href="https://github.com/gaborcsapo/MidtermProject">Check out the project code on Github!!</a></h4>
<h5 style="text-align: center;"><a href="http://diydj.herokuapp.com">Click here to go to the Website!!</a></h5>
<h1></h1>
<h1><span style="font-weight: 400;">Lessons learnt:<a href="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205249/20161214_2349311.jpg"><img class="size-medium wp-image-71681 alignleft" src="http://s3-ap-southeast-1.amazonaws.com/ima-wp/wp-content/uploads/sites/5/2016/12/15205249/20161214_2349311-300x169.jpg" alt="20161214_234931" width="300" height="169" /></a></span></h1>
<span style="font-weight: 400;">My biggest take away from the project is that computer vision and speech recognition isn’t necessarily as hard as I thought. There are high level libraries available that make everything fairly easy, but once I want to alter something I have to dig really deep into the topic.</span>
