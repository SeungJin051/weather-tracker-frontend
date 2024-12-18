export interface PredictData {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
  avgRhm: number;
  month: number;
}

export interface PredictResponse {
  predicted_power_usage: number;
  error?: string;
}

export interface AiProps {
  data: PredictData;
  predictedUsage: number;
}
