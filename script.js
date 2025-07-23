const { HfInference } = HuggingFace;
const hf = new HfInference(process.env.HF_TOKEN);

document.addEventListener('DOMContentLoaded', async () => {
    const eventNameElement = document.getElementById('event-name');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    try {
        const response = await hf.chatCompletion({
            model: "HuggingFaceH4/zephyr-7b-beta",
            messages: [{ role: "user", content: "When is the release date for GPT-5?" }],
            max_tokens: 500,
        });

        const gpt5Response = response.choices[0].message.content;
        const eventName = 'GPT-5 Release Countdown';
        const eventDate = new Date(gpt5Response).getTime();

        if (isNaN(eventDate)) {
            throw new Error('Invalid date format from API');
        }

        eventNameElement.innerText = eventName;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(interval);
                document.getElementById('countdown').innerHTML = '<h1>EVENT HAS STARTED!</h1>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElement.innerText = days;
            hoursElement.innerText = hours;
            minutesElement.innerText = minutes;
            secondsElement.innerText = seconds;
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();
    } catch (error) {
        console.error('Error fetching event data:', error);
        eventNameElement.innerText = 'Could not load event';
        document.getElementById('countdown').innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
});
