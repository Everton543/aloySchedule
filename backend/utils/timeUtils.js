/**
 * Adds minutes to a given time.
 * @param {string} time - The starting time in HH:MM format.
 * @param {number} minsToAdd - The number of minutes to add.
 * @returns {string} The new time in HH:MM format.
 */
function addMinutes(time, minsToAdd) {
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + minsToAdd;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

function getDayOfWeekIndex(dayOfWeek) {
    const days = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
    };
    return days[dayOfWeek.toLowerCase()];
}

function getScheduleDate(dayOfWeek, time) {
    // Function to calculate the date of the schedule based on the day of the week and time
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    const targetDayOfWeek = getDayOfWeekIndex(dayOfWeek);
    let daysUntilTarget = targetDayOfWeek - todayDayOfWeek;

    if (daysUntilTarget < 0) {
        daysUntilTarget += 7;
    }

    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + daysUntilTarget);
    scheduleDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);

    return scheduleDate;
}

module.exports = { addMinutes, getScheduleDate, getDayOfWeekIndex };