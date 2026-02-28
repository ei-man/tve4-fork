interface CDOTA_PanoramaScript_GameEvents {
  Subscribe(eventName: string, callback: (data: any) => void): number;
  SubscribeProtected(eventName: string, callback: (data: any) => void): number;
  SendCustomGameEventToServer(eventName: string, data: any): void;
  SendCustomGameEventToAllClients(eventName: string, data: any): void;
}

interface CDOTA_PanoramaScript_CustomNetTables {
  GetTableValue(tableName: string, key: string | number): any;
  SubscribeNetTableListener(tableName: string, callback: (tableName: string, key: string, data: any) => void): void;
}

interface CustomUIConfig {
  [key: string]: any;
}

interface Panel {
  [key: string]: any;
  text?: any;
  steamid?: string;
  timer?: ScheduleID;
  onDataUpdate?: (data: any) => void;
}
