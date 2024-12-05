# Photon Image Generator

Photon Image Generator is a web application that allows users to generate images using the Photon AI API. It allows users to customize prompts, select aspect ratios, and choose models to create stunning visuals.

## Features

- Enter prompts to guide AI image generation.
- Select predefined aspect ratios such as 1:1 or 16:9.
- Choose different AI models for varied styles and performance.
- User-friendly UI with dynamic styling.

## Installation and Setup

To get started, ensure you have Node.js installed on your machine and an API key for the Photon AI API. First, clone or download the repository to your local machine, then navigate into the project folder and install the necessary dependencies by running `npm install`. Before starting the server, set your Photon AI API key as an environment variable by running `export PHOTO_API_KEY=your_api_key_here` in your terminal. Start the app by using `npm start`.

## How to Use

1. Open the application in your browser by visiting `http://localhost:3000`.
2. Enter a text prompt in the input box to describe the image you want to generate.
3. Select an aspect ratio by clicking one of the provided options (e.g., 1:1, 16:9).
4. Choose a model from the dropdown menu (e.g., `photon-1`, `photon-flash-1`).
5. Click the "Generate Image" button to create the image.
6. The generated image will appear below the form.

## File Structure

- `server.js`: Backend server to handle requests and communicate with the Photon AI API.
- `index.html`: The main HTML file for the application's UI.
- `script.js`: Frontend JavaScript for handling user interactions and API requests.
- `styles.css`: Styling for the application.

## Troubleshooting

If port 3000 is already in use, free it by running the command `lsof -i :3000` to identify the process, then kill the process using its PID with `kill -9 <PID>`. If the API key is missing, ensure you have exported it correctly in your terminal before running the server using `export PHOTO_API_KEY=your_api_key_here`.

## License

This project is closed source and proprietary. All rights are reserved. For inquiries about usage or redistribution, please contact the project owner.