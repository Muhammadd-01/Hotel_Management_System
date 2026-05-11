// StatusBadge.jsx - yeh component status ke hisaab se colored badge dikhata hai
// reusable component - rooms aur bookings dono mein use hota hai

const StatusBadge = ({ status }) => {
  // status ke hisaab se CSS class decide karo
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'confirmed':
      case 'completed':
      case 'resolved':
      case 'responded':
        return 'badge-success';    // green
      case 'booked':
      case 'pending':
        return 'badge-warning';    // orange
      case 'cleaning':
      case 'in progress':
      case 'reviewed':
        return 'badge-info';       // blue
      case 'checked-out':
      case 'closed':
        return 'badge-secondary';  // gray
      case 'cancelled':
      case 'reported':
      case 'critical':
        return 'badge-danger';     // red
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
