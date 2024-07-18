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

// function getDayOfWeekIndex(dayOfWeek) {
//     const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     return days.indexOf(dayOfWeek);
// }

function getScheduleDate(dayOfWeek, time, dateStart, dateEnd) {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    const targetDayOfWeek = getDayOfWeekIndex(dayOfWeek);

    // Find the first occurrence of the target day of the week within the range
    const startDayOfWeek = start.getDay();
    let daysUntilTarget = targetDayOfWeek - startDayOfWeek;

    if (daysUntilTarget < 0) {
        daysUntilTarget += 7;
    }

    const scheduleDate = new Date(start);
    scheduleDate.setDate(start.getDate() + daysUntilTarget);
    scheduleDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);

    if (scheduleDate >= start && scheduleDate <= end) {
        return scheduleDate;
    } else {
        // Calculate the next occurrence within the range
        scheduleDate.setDate(scheduleDate.getDate() + 7);
        if (scheduleDate >= start && scheduleDate <= end) {
            return scheduleDate;
        } else {
            return null; // No valid schedule date within the range
        }
    }
}

function formatDate(dateString, style) {
    const [year, month, day] = dateString.split('-');
    if(style == "brazilianStyle"){
        return `${day}/${month}/${year}`;
    }else{
        return `${month}/${day}/${year}`;
    }
  }

module.exports = { addMinutes, getScheduleDate, getDayOfWeekIndex, formatDate };