import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuantityService } from '../../services/quantity.service';
import { ToastService } from '../../services/toast.service';
import { Category, CategoryConfig, Operation } from '../../models/models';

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  length: {
    key: 'length', label: 'Length', icon: '📏',
    units: { Feet: 'Feet', Inches: 'Inches', Yards: 'Yards', Centimeters: 'Centimeters', Meters: 'Meters' },
    ops: ['convert', 'add', 'subtract', 'divide', 'equals']
  },
  weight: {
    key: 'weight', label: 'Weight', icon: '⚖️',
    units: { Kilograms: 'Kilograms', Grams: 'Grams', Pounds: 'Pounds', Ounces: 'Ounces' },
    ops: ['convert', 'add', 'subtract', 'divide', 'equals']
  },
  volume: {
    key: 'volume', label: 'Volume', icon: '🧪',
    units: { Litres: 'Litres', Millilitres: 'Millilitres', Gallons: 'Gallons' },
    ops: ['convert', 'add', 'subtract', 'divide', 'equals']
  },
  temperature: {
    key: 'temperature', label: 'Temperature', icon: '🌡️',
    units: { Celsius: 'Celsius', Fahrenheit: 'Fahrenheit', Kelvin: 'Kelvin' },
    ops: ['convert', 'equals']
  }
};

export interface CalcResult {
  value: string;
  equation: string;
  isEqual?: boolean;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe, RouterLink],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private quantityService = inject(QuantityService);
  private toast = inject(ToastService);

  categories: Category[] = ['length', 'weight', 'volume', 'temperature'];
  allOps: Operation[] = ['convert', 'add', 'subtract', 'divide', 'equals'];

  opLabels: Record<Operation, string> = {
    convert: 'Convert',
    add: 'Add',
    subtract: 'Subtract',
    divide: 'Divide',
    equals: 'Equality'
  };

  opDescriptions: Record<Operation, string> = {
    convert: 'Convert a value from one unit to another.',
    add: 'Add two measurements.',
    subtract: 'Subtract second from first.',
    divide: 'Divide first by second.',
    equals: 'Check equality.'
  };

  selectedCat: Category = 'length';
  selectedOp: Operation = 'convert';

  val1: number | null = null;
  val2: number | null = null;
  unit1 = '';
  unit2 = '';
  unitOut = '';

  loading = false;
  result: CalcResult | null = null;

  get cfg(): CategoryConfig { return CATEGORY_CONFIG[this.selectedCat]; }
  get unitKeys(): string[] { return Object.keys(this.cfg.units); }
  get needsTwo(): boolean { return ['add', 'subtract', 'divide', 'equals'].includes(this.selectedOp); }

  get opSymbol(): string {
    return {
      add: '+',
      subtract: '−',
      divide: '÷',
      convert: '→',
      equals: '='
    }[this.selectedOp] || '';
  }

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      const cat = p['cat'] as Category;
      if (cat && CATEGORY_CONFIG[cat]) this.selectCat(cat);
      else this.selectCat('length');
    });
  }

  selectCat(cat: Category) {
    this.selectedCat = cat;
    this.selectedOp = this.cfg.ops[0];
    this.resetInputs();
  }

  selectOp(op: Operation) {
    if (!this.cfg.ops.includes(op)) return;
    this.selectedOp = op;
    this.resetInputs();
  }

  resetInputs() {
    const keys = this.unitKeys;
    this.unit1 = keys[0];
    this.unit2 = keys[1] ?? keys[0];
    this.unitOut = keys[0];
    this.val1 = null;
    this.val2 = null;
    this.result = null;
  }

  swapUnits() {
    [this.unit1, this.unit2] = [this.unit2, this.unit1];
  }

  calculate() {
    if (this.val1 == null) {
      this.toast.show('Enter value', 'error');
      return;
    }

    if (this.needsTwo && this.val2 == null) {
      this.toast.show('Enter both values', 'error');
      return;
    }

    this.loading = true;
    this.result = null;

    const v1 = Number(this.val1);
    const v2 = Number(this.val2);

    if (this.selectedOp === 'convert') {
      this.quantityService.convert({
        value: v1,
        fromUnit: this.unit1,
        toUnit: this.unit2
      }).subscribe({
        next: res => {
          this.result = {
            value: res.formattedResult ?? res.message,
            equation: `${v1} ${this.unit1} → ${res.formattedResult}`
          };
          this.loading = false;
        },
        error: err => this.handleError(err)
      });

    } else if (this.selectedOp === 'equals') {
      this.quantityService.compare({
        quantity1: { value: v1, unit: this.unit1 },
        quantity2: { value: v2, unit: this.unit2 }
      }).subscribe({
        next: res => {
          const equal = res.success && !res.message?.toLowerCase().includes('not');
          this.result = {
            value: equal ? 'Equal' : 'Not Equal',
            equation: `${v1} ${this.unit1} ${equal ? '=' : '≠'} ${v2} ${this.unit2}`,
            isEqual: equal
          };
          this.loading = false;
        },
        error: err => this.handleError(err)
      });

    } else if (this.selectedOp === 'add') {
      this.quantityService.add({
        quantity1: { value: v1, unit: this.unit1 },
        quantity2: { value: v2, unit: this.unit2 },
        resultUnit: this.unitOut
      }).subscribe({
        next: res => {
          this.result = {
            value: res.formattedResult ?? res.message,
            equation: `${v1} + ${v2} = ${res.formattedResult}`
          };
          this.loading = false;
        },
        error: err => this.handleError(err)
      });

    } else if (this.selectedOp === 'subtract') {
      this.quantityService.subtract({
        quantity1: { value: v1, unit: this.unit1 },
        quantity2: { value: v2, unit: this.unit2 },
        resultUnit: this.unitOut
      }).subscribe({
        next: res => {
          this.result = {
            value: res.formattedResult ?? res.message,
            equation: `${v1} - ${v2} = ${res.formattedResult}`
          };
          this.loading = false;
        },
        error: err => this.handleError(err)
      });

    } else if (this.selectedOp === 'divide') {
      this.quantityService.divide({
        quantity1: { value: v1, unit: this.unit1 },
        quantity2: { value: v2, unit: this.unit2 }
      }).subscribe({
        next: res => {
          this.result = {
            value: `${res.ratio}`,
            equation: `${v1} ÷ ${v2} = ${res.ratio}`
          };
          this.loading = false;
        },
        error: err => this.handleError(err)
      });
    }
  }

  private handleError(err: any) {
    this.loading = false;
    this.toast.show(err?.error || 'Backend error', 'error');
  }
}