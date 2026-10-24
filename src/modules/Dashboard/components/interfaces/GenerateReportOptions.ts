export interface GenerateReportOptions {
  label: string;
  outputFileFormat: string;
  outputOptions: { [key: string]: boolean };
  outputPath: string;
}
