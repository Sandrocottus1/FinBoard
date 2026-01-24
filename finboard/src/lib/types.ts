export type WType = 'card' | 'table' | 'chart';

export interface WMap {
  val?: string;       // For Card (Value)
  lbl?: string;       // For Card (Label)
  x?: string;         // For Chart (X Axis)
  y?: string;         // For Chart (Y Axis)
  cols?: string[];    // For Table
}

export interface WCfg {
  id: string;
  name: string;
  type: 'card' | 'table' | 'chart' | 'socket';
  url: string;
  freq: number;      
  map: WMap;          
  
}