import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import $ from 'jquery';
import style from './FullCalendarComponent.module.css';
import HourListModal from '../Modals/HourListModal';
import ScheduleFormModal from '../Modals/ScheduleFormModal';
import { useTranslation } from 'react-i18next';

const FullCalendarComponent = ({ clientLink, locale, services, logedIn }) => {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [isHourListModalOpen, setHourListModalOpen] = useState(false);
    const [isScheduleFormModalOpen, setScheduleFormModalOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [selectedPhone, setSelectedPhone] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const calendarRef = useRef(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const lang = searchParams.get('lang');
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
            locale = i18n.language;
        }
    }, [i18n]);

    const fetchSchedules = async (viewType, start, end) => {
        try {
            $.ajax({
                url: `/ajax/user/get-schedule`,
                method: 'GET',
                data: { clientLink, viewType, start, end },
                success: (data) => {
                    setSchedules(data.schedule);
                    setSelectedName(data.currentUserName);
                    const daysOfWeekMap = {
                        'monday': 1,
                        'tuesday': 2,
                        'wednesday': 3,
                        'thursday': 4,
                        'friday': 5,
                        'saturday': 6,
                        'sunday': 0
                    };
    
                    if (viewType === 'timeGridWeek') {
                        const hourlyStatus = {};
    
                        data.schedule.forEach(schedule => {
                            const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
                            const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
                            const date = schedule.date;
                        
                            if (startHour === endHour && startMinute <= endMinute) {
                                const key = `${date}_${startHour}`;
                                if (!hourlyStatus[key]) {
                                    hourlyStatus[key] = [];
                                }
                                hourlyStatus[key].push(schedule.availability);
                            } else {
                                for (let hour = startHour; hour < endHour; hour++) {
                                    const key = `${date}_${hour}`;
                                    if (!hourlyStatus[key]) {
                                        hourlyStatus[key] = [];
                                    }
                                    
                                    if (hour === startHour && startMinute > 0) {
                                        hourlyStatus[key].push(schedule.availability);
                                    } else if (hour === endHour && endMinute < 60) {
                                        hourlyStatus[key].push(schedule.availability);
                                    }else if (hour !== startHour && hour !== endHour) {
                                        hourlyStatus[key].push(schedule.availability);
                                    }
                                }
                            }
                        });
    
                        const events = Object.entries(hourlyStatus).map(([key, availabilities]) => {
                            const [date, hour] = key.split('_');
                            const status = availabilities.every(a => a === 'not vacant') ? 'tagNotVacant' : 'tagVacant';
    
                            return {
                                title: status,
                                start: `${date}T${String(hour).padStart(2, '0')}:00:00`,
                                end: `${date}T${String(parseInt(hour) + 1).padStart(2, '0')}:00:00`,
                                allDay: false
                            };
                        });
    
                        setEvents(events);
    
                    } else if (viewType === 'listDay') {
                        const events = data.schedule.map(schedule => ({
                            title: schedule.availability === 'not vacant' ? 'tagNotVacant' : 'tagVacant',
                            start: `${schedule.date}T${schedule.startTime}:00`,
                            end: `${schedule.date}T${schedule.endTime}:00`,
                            allDay: false
                        }));
    
                        setEvents(events);
    
                    } else if (viewType === 'dayGridMonth') {
                        const dailyStatus = {};
    
                        data.schedule.forEach(schedule => {
                            const date = schedule.date;
                            if (!dailyStatus[date]) {
                                dailyStatus[date] = { total: 0, notVacant: 0 };
                            }
                            dailyStatus[date].total++;
                            if (schedule.availability === 'not vacant') {
                                dailyStatus[date].notVacant++;
                            }
                        });
    
                        const events = Object.entries(dailyStatus).map(([date, { total, notVacant }]) => {
                            const backgroundColor = notVacant === total ? 'gray' : (notVacant === 0 ? 'green' : 'white');
                            const title = notVacant > 0 ? `${t('tagAppointments')}: ${notVacant}` : 'Vacant';
    
                            return {
                                title: title,
                                start: `${date}T00:00:00`,
                                end: `${date}T23:59:59`,
                                allDay: true,
                                backgroundColor: backgroundColor
                            };
                        });
    
                        setEvents(events);
                    }
                },
                error: (error) => {
                    console.error('Error fetching schedules:', error);
                }
            });
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    useEffect(() => {
        const calendarApi = calendarRef.current.getApi();
        const viewType = calendarApi.view.type;
        const start = calendarApi.view.activeStart.toISOString();
        const end = calendarApi.view.activeEnd.toISOString();
        fetchSchedules(viewType, start, end);
    }, [clientLink]);

    const logEventsInHour = (dayOfWeek, startHour, endHour, date) => {
        const daysOfWeekMap = {
            'monday': 1,
            'tuesday': 2,
            'wednesday': 3,
            'thursday': 4,
            'friday': 5,
            'saturday': 6,
            'sunday': 0
        };

        const schedulesInHour = schedules.filter(schedule => {
            const scheduleDay = daysOfWeekMap[schedule.dayOfWeek];
            const scheduleStart = new Date(`1970-01-01T${schedule.startTime}:00`);
            const scheduleEnd = new Date(`1970-01-01T${schedule.endTime}:00`);
            const filterStart = new Date(`1970-01-01T${String(startHour).padStart(2, '0')}:00:00`);
            const filterEnd = new Date(`1970-01-01T${String(endHour).padStart(2, '0')}:00:00`);

            return scheduleDay === dayOfWeek && (
                (scheduleStart < filterEnd && scheduleEnd > filterStart)
            ) && schedule.availability === 'vacant';
        });

        setSelectedSchedules(schedulesInHour.map(schedule => ({ ...schedule, date })));
        setSelectedDate(date);
        setHourListModalOpen(true);
    };

    const handleHourClick = (schedule) => {
        setSelectedPhone('');
        setSelectedService('');
        setSelectedHour(schedule.startTime);
        setSelectedDate(schedule.date);
        setHourListModalOpen(false);
        setScheduleFormModalOpen(true);
    };

    const handleDatesSet = (dateInfo) => {
        const viewType = dateInfo.view.type;
        const start = dateInfo.startStr;
        const end = dateInfo.endStr;
        fetchSchedules(viewType, start, end);
    };

    const renderEventContent = (eventInfo) => {
        const startHour = eventInfo.event.start.getHours();
        const endHour = eventInfo.event.end.getHours();
        const dayOfWeek = eventInfo.event.start.getDay();
        const eventDate = eventInfo.event.start.toISOString().split('T')[0];
        const eventTitle = eventInfo.event.title;
    
        const isNotVacant = eventTitle === 'tagNotVacant' || eventTitle.startsWith('Not Vacant');
    
        return (
            <div className={style.event_content} data-start-hour={startHour} data-end-hour={endHour}>
                <button
                    className={`btn ${isNotVacant ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={isNotVacant ? null : () => logEventsInHour(dayOfWeek, startHour, endHour, eventDate)}
                    disabled={isNotVacant}
                >
                    {t(eventTitle)}
                </button>
            </div>
        );
    };

    const renderEventContentMonth = (eventInfo) => {
        const eventTitle = eventInfo.event.title;

        return (
            <div className={style.event_content}>
                <span>{eventTitle}</span>
            </div>
        );
    };

    const reloadEvents = () => {
        const calendarApi = calendarRef.current.getApi();
        const viewType = calendarApi.view.type;
        const start = calendarApi.view.activeStart.toISOString();
        const end = calendarApi.view.activeEnd.toISOString();
        fetchSchedules(viewType, start, end);
    };

    const renderEventDay = (eventInfo) => {
        const eventTitle = eventInfo.event.title;
        const localStartTime = eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const localDate = eventInfo.event.start.toISOString().split('T')[0];
        const isNotVacant = eventTitle === 'tagNotVacant' || eventTitle.startsWith('Not Vacant');
        return (
            <div className={style.event_content}>
                <button
                    className={`btn ${isNotVacant ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={isNotVacant ? null : () => handleHourClick({
                        startTime: localStartTime,
                        date: localDate
                    })}
                >
                    {t(eventTitle)}
                </button>
            </div>
        );
    };

    const renderEvent = (eventInfo) => {
        const viewType = calendarRef.current.getApi().view.type;
        return viewType === 'dayGridMonth' ? renderEventContentMonth(eventInfo) : viewType === 'listDay' ? renderEventDay(eventInfo) : renderEventContent(eventInfo);
    };

    const handleDateClick = (info) => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView('listDay', info.dateStr);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listDay'
                }}
                views={{
                    listDay: {
                        buttonText: t('tagDay')
                    },
                    timeGridWeek: {
                        allDaySlot: false
                    }
                }}
                locale={locale}
                locales={allLocales}
                events={events}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                height="auto"
                eventContent={renderEvent}
                datesSet={handleDatesSet}
                ref={calendarRef}
                dateClick={handleDateClick}
            />
            <HourListModal
                isOpen={isHourListModalOpen}
                onRequestClose={() => setHourListModalOpen(false)}
                schedules={selectedSchedules}
                onHourClick={handleHourClick}
            />
            <ScheduleFormModal
                isOpen={isScheduleFormModalOpen}
                onRequestClose={() => setScheduleFormModalOpen(false)}
                selectedName={selectedName}
                selectedPhone={selectedPhone}
                service={selectedService}
                hour={selectedHour}
                date={selectedDate}
                services={services}
                logedIn={logedIn}
                clientLink={clientLink}
                reloadEvents={reloadEvents} // Pass the function to the modal
            />
        </div>
    );
};

export default FullCalendarComponent;