type AvailableCheckType = 'JAVASCRIPT' | 'HTML' | 'CSS' | 'JSON';

export interface AvailableCheck {
  id: string;
  name: string;
  title: string;
  type: AvailableCheckType;
  description: string;
}
