// StatusBadge.jsx - Renders a color-coded badge based on the provided status
// Reusable component used for both Rooms and Bookings

const StatusBadge = ({ status }) => {
  // Determine the CSS class based on the status string
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'confirmed':
      case 'completed':
      case 'resolved':
      case 'responded':
        return 'badge-success';    // Emerald/Green
      case 'booked':
      case 'pending':
        return 'badge-warning';    // Amber/Orange
      case 'cleaning':
      case 'in progress':
      case 'reviewed':
        return 'badge-info';       // Blue
      case 'checked-out':
      case 'closed':
        return 'badge-secondary';  // Gray/Slate
      case 'cancelled':
      case 'reported':
      case 'critical':
        return 'badge-danger';     // Red
      default:
        return 'badge-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
