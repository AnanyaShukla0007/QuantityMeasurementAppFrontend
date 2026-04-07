// ─── Auth ─────────────────────────────────────────────────────────────────────
// Backend expects { username, password } — NOT email/name.
// Backend register also accepts { role } (set to "Admin" so quantity endpoints work).

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;     // use "Admin" — backend controller requires Roles="Admin"
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Backend only returns { token } — no user object
export interface AuthResponse {
  token: string;
}

// ─── MeasurementCategory enum (matches backend JsonStringEnumConverter) ───────
export type MeasurementCategory = 'Length' | 'Weight' | 'Volume' | 'Temperature';

// ─── QuantityDTO — every operand sent to backend must include category ─────────
export interface QuantityDTO {
  value: number;
  unit: string;
  category: MeasurementCategory;
}

// ─── Request DTOs (match backend exactly) ─────────────────────────────────────

// POST /api/v1/quantities/convert
export interface ConvertRequest {
  source: QuantityDTO;
  targetUnit: string;
}

// POST /api/v1/quantities/compare | add | subtract | divide
export interface BinaryQuantityRequest {
  quantity1: QuantityDTO;
  quantity2: QuantityDTO;
  targetUnit?: string;    // required for add/subtract to specify result unit
}

// ─── Response DTOs (match backend exactly) ────────────────────────────────────

// convert | add | subtract | compare all return QuantityResponse
export interface QuantityResponse {
  success: boolean;
  message: string;
  formattedResult?: string;   // e.g. "3.048 Meters" — parse this for display
}

// divide returns DivisionResponse
export interface DivisionResponse {
  success: boolean;
  message: string;
  ratio: number;
  interpretation: string;
}

// ─── History ──────────────────────────────────────────────────────────────────
// GET /api/v1/quantities/history → List<QuantityMeasurementEntity>
// Backend serialises PascalCase (no camelCase policy set in Program.cs)
export interface OperationHistory {
  id: number;
  operationType: string;        // "CONVERT" | "COMPARE" | "ADD" | "SUBTRACT" | "DIVIDE"
  measurementCategory: string;  // "Length" | "Weight" | "Volume" | "Temperature"
  operand1Value: number;
  operand1Unit: string;
  operand2Value: number;
  operand2Unit: string;
  resultValue: number;
  resultUnit: string;
  errorMessage?: string;
  timestamp: string;
}

// ─── UI helper types ──────────────────────────────────────────────────────────
export type Category = 'length' | 'weight' | 'volume' | 'temperature';
export type Operation = 'convert' | 'add' | 'subtract' | 'divide' | 'equals';

export interface CategoryConfig {
  key: Category;
  label: string;
  icon: string;
  units: { [key: string]: string };
  ops: Operation[];
}
