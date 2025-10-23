export interface RegisterStep {
  id: string;
  title: string;
  description: string;
  path: string;
  completed: boolean;
  data?:any;
}