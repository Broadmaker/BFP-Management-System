export function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
export function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
