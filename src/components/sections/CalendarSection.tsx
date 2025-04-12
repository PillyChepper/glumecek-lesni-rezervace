
import Section from '@/components/Section';
import ReservationCalendar from '@/components/Calendar';

const CalendarSection = () => {
  return (
    <Section id="kalendar">
      <h2 className="section-title text-center mb-12">Ověřte si dostupnost</h2>
      <ReservationCalendar 
        disabledDates={[
          new Date(2025, 3, 15),
          new Date(2025, 3, 16),
          new Date(2025, 3, 17),
          new Date(2025, 3, 18),
        ]}
      />
    </Section>
  );
};

export default CalendarSection;
