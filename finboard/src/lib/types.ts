export type WType = 'chart' | 'table' | 'text';

export interface WMap{

    val?:string;
    lbl?:string;
    x?:string;
    y?:string;
    cols?:string[];
}

export interface WCfg {

    id: string;
  name: string;
  type: WType;
  url: string;
  freq: number;       // Refresh interval
  map: WMap;

}