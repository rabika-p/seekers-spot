## Seekers Spot

## Overview 
Seekers Spot is a Lost and Found Platform developed using MERN (MongoDB, Express.js, React, Node.js) stack.    


**Post Lost and Found Items**  
  Share details such as item name, category, lost date, location, and images of the item.  
  
**Efficient Search**  
  Search for both lost and found items using item name and/or filter using keywords, categories, and lost/found dates.    
  
**Claim Process**  
  Send item claims, initiating a matching process for easy item recovery.
  
 ## Technologies Used  
  ### Frontend:  
  
  - React with TypeScript
  - Tailwind CSS for styling
  - Axios for API communication
  
  ### Backend:  
  
  - Node.js with Express.js & TypeScript 
  - MongoDB with Mongoose
  - Multer for multiple image upload
      
  ### Authentication:  
  
  - JSON Web Tokens (JWT)  

  ### Email Communication:  

  - Nodemailer for sending password reset emails  


## Data Model Diagram
![Datamodel](https://github.com/rabika-p/seekers-spot/assets/60596856/9dff3d0a-cc33-44c5-8578-7b2a4f9f8221)

## Architecture Diagram
![Architecture](https://github.com/rabika-p/seekers-spot/assets/60596856/22e48933-44f8-41aa-ae7b-6a78a734e4bf)


## Project Screenshots
**Signin Page**
![Signin](https://github.com/rabika-p/seekers-spot/assets/60596856/53bfd689-7f09-4291-8501-2727b9e9eac1)

**Lost Items Listing**
![Listing](https://github.com/rabika-p/seekers-spot/assets/60596856/a08d2f63-11bd-4e25-8bec-c20bbc0509e6)

**Individual Listing View**
![Listing Detail](https://github.com/rabika-p/seekers-spot/assets/60596856/2d7ba0cc-e301-44bc-a7ff-765a8f223518)

**View Received Claims**
![Received Claims](https://github.com/rabika-p/seekers-spot/assets/60596856/74724983-51cb-4459-b709-0d7d991348c4)

## Installation

1. Clone the repository:

   git clone https://github.com/rabika-p/seekers-spot.git  
   cd seekers-spot 

2. Install the dependencies:  
     `cd be`  
    `npm install`  
     `cd fe`  
    `npm install`  
   
4. Set up environment variables:  
     ##### Backend (.env in be directory) 
      ###### Port for the server
      `PORT=3000`
     ###### Secret key for JWT authentication
      `JWT_SECRET=your_secret_key_here`
     ###### MongoDB URI
      `URI=your_mongodb_uri`
     ###### Email Configuration for Password Reset
      `EMAIL=your_email@example.com`  
      `PSW=your_email-password`  

## Usage  
To start the development server for both the client and the server, run the following commands:  
    `cd be`  
    `npm start`  
     `cd fe`  
    `npm run dev`
