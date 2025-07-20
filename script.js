document.addEventListener('DOMContentLoaded', () => {
    const eventNameElement = document.getElementById('event-name');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    fetch('event.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            console.log('Fetched text:', text);
            const lines = text.trim().split('\n');
            if (lines.length < 2) {
                throw new Error('Invalid event file format');
            }
            const eventName = lines[0];
            const eventDateStr = lines[1];
            console.log('Event Name:', eventName);
            console.log('Event Date String:', eventDateStr);
            const eventDate = new Date(eventDateStr).getTime();
            console.log('Event Date Timestamp:', eventDate);


            if (isNaN(eventDate)) {
                throw new Error('Invalid date format');
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
        })
        .catch(error => {
            console.error('Error fetching event data:', error);
            eventNameElement.innerText = 'Could not load event';
            document.getElementById('countdown').innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
});
