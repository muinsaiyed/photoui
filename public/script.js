// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Lightbeam animation setup
    const canvas = document.getElementById('lightBeam');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Light beam properties
    let particles = Array.from({ length: 20 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 50 + 50,
        color: `rgba(251, 111, 146, ${Math.random() * 0.3})`, // Using your pink color
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
    }));

    // Animate the particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            particle.x += particle.dx;
            particle.y += particle.dy;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
        requestAnimationFrame(animateParticles);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recreate particles on resize
        particles = Array.from({ length: 20 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 50 + 50,
            color: `rgba(251, 111, 146, ${Math.random() * 0.3})`,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
        }));
    });

    // Start animation
    animateParticles();

    // Form submission handler
    document.getElementById('generate-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Disable the button
        const generateButton = document.querySelector('.generate-button');
        generateButton.disabled = true;

        const prompt = document.getElementById('prompt').value;
        const model = document.getElementById('model').value;
        const aspect_ratio = document.querySelector('input[name="aspect_ratio"]').value;

        const data = {
            prompt: prompt,
            aspect_ratio: aspect_ratio,
            model: model
        };

        // Update the loading message with better styling
        document.getElementById('result').innerHTML = '<p class="loading-text">✨ Generating your image, please wait...</p>';

        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(data)}`);
            }
            return data;
        })
        .then(data => {
            console.log('Generation initiated:', data);
            const generationId = data.id;

            if (!generationId) {
                throw new Error('No generation ID received');
            }

            checkStatus(generationId);
        })
        .catch((error) => {
            console.error('Error:', error.message);
            document.getElementById('result').innerHTML = `<p class="loading-text">❌ Error generating image: ${error.message}</p>`;
            // Re-enable the button on error
            generateButton.disabled = false;
        });
    });

    // Aspect ratio buttons setup
    const aspectButtons = document.querySelectorAll('.aspect-button');
    const aspectRatioInput = document.createElement('input');
    aspectRatioInput.type = 'hidden';
    aspectRatioInput.name = 'aspect_ratio';
    aspectRatioInput.value = '16:9'; // Default value
    document.getElementById('generate-form').appendChild(aspectRatioInput);

    aspectButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            aspectButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            // Update hidden input value
            aspectRatioInput.value = this.dataset.ratio;
        });
    });
});

// Keep checkStatus function outside since it's just a helper function
function checkStatus(generationId) {
    const generateButton = document.querySelector('.generate-button');
    
    fetch(`/api/status/${generationId}`)
    .then(response => response.json())
    .then(data => {
        console.log('Status check:', data);

        if (data.state === 'succeeded' || data.state === 'completed') {
            let imageUrl = null;

            if (data.output && data.output.length > 0) {
                imageUrl = data.output[0];
            }
            else if (data.assets && data.assets.image) {
                imageUrl = data.assets.image;
            }

            if (imageUrl) {
                document.getElementById('result').innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
            } else {
                console.error('Image URL not found in response.');
                document.getElementById('result').innerHTML = '<p class="loading-text">❌ Error: Image URL not found.</p>';
            }
            // Re-enable the button when generation is complete
            generateButton.disabled = false;
        } else if (['processing', 'pending', 'queued', 'dreaming'].includes(data.state)) {
            // Update loading message with current state
            document.getElementById('result').innerHTML = `<p class="loading-text">✨ ${data.state.charAt(0).toUpperCase() + data.state.slice(1)}...</p>`;
            setTimeout(() => {
                checkStatus(generationId);
            }, 3000);
        } else if (data.state === 'failed') {
            const failureReason = data.failure_reason || 'Unknown error';
            console.error('Image generation failed:', failureReason);
            document.getElementById('result').innerHTML = `<p class="loading-text">❌ Image generation failed: ${failureReason}</p>`;
            // Re-enable the button on failure
            generateButton.disabled = false;
        } else {
            console.error('Unexpected state:', data.state);
            document.getElementById('result').innerHTML = `<p class="loading-text">❌ Unexpected state: ${data.state}</p>`;
            // Re-enable the button on unexpected state
            generateButton.disabled = false;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = '<p class="loading-text">❌ Error checking image status.</p>';
        // Re-enable the button on error
        generateButton.disabled = false;
    });
}
