export type TicketPriority = 'blocked' | 'needs-input' | 'design' | 'active' | 'pending' | 'utility' | 'low' | 'error';

export interface SageTicket {
  id: string;
  file: string;
  status: string;
  description: string;
  priority: TicketPriority;
  category: string;
  detail: string;
}

export const PRIORITY_STYLES: Record<TicketPriority, { bg: string; text: string; border: string; label: string }> = {
  blocked:     { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30',    label: 'Blocked' },
  'needs-input': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30',  label: 'Needs Input' },
  design:      { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30',   label: 'Design Stage' },
  active:      { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30',  label: 'Active' },
  pending:     { bg: 'bg-gray-500/15',   text: 'text-gray-400',   border: 'border-gray-500/30',   label: 'Pending' },
  utility:     { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Utility' },
  low:         { bg: 'bg-gray-500/10',   text: 'text-gray-500',   border: 'border-gray-500/20',   label: 'Low' },
  error:       { bg: 'bg-red-500/20',    text: 'text-red-300',    border: 'border-red-500/40',    label: 'Error' },
};
