import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import $ from 'jquery';

const FullCalendarComponent = ({ clientLink, locale }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                $.ajax({
                    url: `/ajax/clients/get-schedule`,
                    method: 'GET',
                    data: { clientLink },
                    success: (data) => {
                        const schedules = data;
                        
                        const events = schedules.map(schedule => {
                            const startTime = schedule.startTime.split(':');
                            const endTime = schedule.endTime.split(':');
                            
                            // Create a series of events for each day of the week the client is available
                            const daysOfWeekMap = {
                                'monday': 1,
                                'tuesday': 2,
                                'wednesday': 3,
                                'thursday': 4,
                                'friday': 5,
                                'saturday': 6,
                                'sunday': 0
                            };

                            return {
                                title: 'Available',
                                daysOfWeek: [daysOfWeekMap[schedule.dayOfWeek]],
                                startTime: `${startTime[0]}:${startTime[1]}`,
                                endTime: `${endTime[0]}:${endTime[1]}`,
                                allDay: false
                            };
                        });

                        setEvents(events);
                    },
                    error: (error) => {
                        console.error('Error fetching schedules:', error);
                    }
                });
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, [clientLink]);

    const renderEventContent = (eventInfo) => {
        return (
            <div>
                <b>{eventInfo.timeText}</b>
                <br/>
                <i>{eventInfo.event.title}</i>
            </div>
        );
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            views={{
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
            eventContent={renderEventContent}
        />
    );
};

export default FullCalendarComponent;
