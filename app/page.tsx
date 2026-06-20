"use client";

import React, { useState, useEffect } from "react";

interface Currency {
  symbol: string;
  code: string;
  name: string;
}

const currencies: Currency[] = [
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
];

export default function GSTCalculator() {
  // State variables with sensible defaults
  const [amount, setAmount] = useState<string>("1000");
  const [gstRate, setGstRate] = useState<string>("18");
  const [calculationMode, setCalculationMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Parse strings to float safely
  const numAmount = parseFloat(amount) || 0;
  const numGstRate = parseFloat(gstRate) || 0;

  // Calculation formulas
  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (calculationMode === "exclusive") {
    baseAmount = numAmount;
    gstAmount = (numAmount * numGstRate) / 100;
    totalAmount = numAmount + gstAmount;
  } else {
    totalAmount = numAmount;
    baseAmount = numAmount / (1 + numGstRate / 100);
    gstAmount = numAmount - baseAmount;
  }

  // Visual percentages for the breakdown bar
  const basePercent = totalAmount > 0 ? (baseAmount / totalAmount) * 100 : 100;
  const gstPercent = totalAmount > 0 ? (gstAmount / totalAmount) * 100 : 0;

  // Clipboard functionality for individual values
  const copyToClipboard = (val: number, label: string) => {
    navigator.clipboard.writeText(val.toFixed(2));
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Clipboard functionality for the entire transaction summary
  const copyFullSummary = () => {
    const modeText = calculationMode === "exclusive" ? "GST Exclusive (Add Tax)" : "GST Inclusive (Remove Tax)";
    const summary = `GST TAX CALCULATION REPORT
----------------------------------
Calculation Mode: ${modeText}
Selected Currency: ${selectedCurrency.code} (${selectedCurrency.symbol})
----------------------------------
Base Amount:      ${selectedCurrency.symbol}${formatVal(baseAmount)}
GST Rate:         ${numGstRate.toFixed(2)}%
GST Amount:       ${selectedCurrency.symbol}${formatVal(gstAmount)}
----------------------------------
Total Net Amount: ${selectedCurrency.symbol}${formatVal(totalAmount)}
----------------------------------
Generated via GST Tax Calculator
Built for Digital Heroes (https://digitalheroesco.com)
Developer: Saksham Joshi (saksham.joshi08052006@gmail.com)`;

    navigator.clipboard.writeText(summary);
    setCopiedField("summary");
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Preset rates handler
  const selectPreset = (rate: number) => {
    setGstRate(rate.toString());
  };

  // Quick reset
  const handleReset = () => {
    setAmount("");
    setGstRate("18");
  };

  // Helper to format currency values cleanly
  const formatVal = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-zinc-950 dark:text-slate-100">
      {/* Ambient background glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-5000" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
              Tax Computation Suite
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-zinc-200">
              GST Tax Calculator
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
              Perform high-precision Goods and Services Tax calculations instantly for exclusive or inclusive rates.
            </p>
          </div>

          {/* Calculator Card Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xl overflow-hidden">
            
            {/* Inputs Panel */}
            <div className="p-6 sm:p-8 md:col-span-7 space-y-6">
              
              {/* Tab Selector */}
              <div className="space-y-2">
                <span id="calc-method-label" className="text-xs font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                  Calculation Method
                </span>
                <div role="tablist" aria-labelledby="calc-method-label" className="relative grid grid-cols-2 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
                  {/* Sliding pill background */}
                  <div 
                    className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-700 rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${
                      calculationMode === "inclusive" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
                    }`}
                  />
                  <button
                    role="tab"
                    id="tab-exclusive"
                    aria-controls="panel-exclusive-inclusive"
                    aria-selected={calculationMode === "exclusive"}
                    onClick={() => setCalculationMode("exclusive")}
                    className={`relative z-10 py-2 text-xs md:text-sm font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors duration-300 ${
                      calculationMode === "exclusive"
                        ? "text-indigo-950 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    GST Exclusive (+ Add)
                  </button>
                  <button
                    role="tab"
                    id="tab-inclusive"
                    aria-controls="panel-exclusive-inclusive"
                    aria-selected={calculationMode === "inclusive"}
                    onClick={() => setCalculationMode("inclusive")}
                    className={`relative z-10 py-2 text-xs md:text-sm font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors duration-300 ${
                      calculationMode === "inclusive"
                        ? "text-indigo-950 dark:text-white"
                        : "text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    GST Inclusive (- Remove)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="amount" className="text-xs font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                    {calculationMode === "exclusive" ? "Base Amount" : "Total Amount"}
                  </label>
                  {amount && (
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus:outline-none focus-visible:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="relative flex rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 dark:border-zinc-800 dark:focus-within:border-indigo-500/50 transition-all">
                  
                  {/* Currency selector inside the input */}
                  <select
                    value={selectedCurrency.code}
                    aria-label="Select currency symbol"
                    onChange={(e) => {
                      const cur = currencies.find((c) => c.code === e.target.value);
                      if (cur) setSelectedCurrency(cur);
                    }}
                    className="pl-3 pr-2 bg-transparent text-sm font-bold border-r border-slate-200 dark:border-zinc-800 focus:outline-none cursor-pointer rounded-l-xl text-slate-700 dark:text-zinc-300"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-semibold">
                        {c.symbol} ({c.code})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    placeholder="Enter numeric amount"
                    min="0"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || parseFloat(val) >= 0) {
                        setAmount(val);
                      }
                    }}
                    className="block w-full py-3 px-3 bg-transparent text-lg font-semibold focus:outline-none placeholder-slate-300 dark:placeholder-zinc-700"
                  />
                </div>
              </div>

              {/* GST Rate input and Presets */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="gstRate" className="text-xs font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                    GST Rate (%)
                  </label>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {numGstRate}%
                  </span>
                </div>
                
                {/* Numeric input */}
                <div className="relative rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 dark:border-zinc-800 dark:focus-within:border-indigo-500/50 transition-all">
                  <input
                    type="number"
                    id="gstRate"
                    value={gstRate}
                    placeholder="Enter tax percentage"
                    min="0"
                    max="100"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100)) {
                        setGstRate(val);
                      }
                    }}
                    className="block w-full py-3 px-4 bg-transparent text-base font-semibold focus:outline-none placeholder-slate-300 dark:placeholder-zinc-700"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-slate-400 dark:text-zinc-500 font-bold">%</span>
                  </div>
                </div>

                {/* Styled premium range slider */}
                <div className="pt-1.5">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={numGstRate}
                    aria-label="Drag to adjust GST rate percentage"
                    onChange={(e) => setGstRate(e.target.value)}
                    className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                              [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-lg
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:dark:bg-indigo-500 [&::-webkit-slider-thumb]:-translate-y-[6px] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-95
                              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:dark:bg-indigo-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-125 [&::-moz-range-thumb]:active:scale-95"
                  />
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-4 gap-2 pt-1.5">
                  {[5, 12, 18, 28].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => selectPreset(rate)}
                      aria-label={`Set tax rate to ${rate} percent`}
                      className={`py-2.5 rounded-xl text-xs font-bold border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 transition-all ${
                        numGstRate === rate
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm dark:bg-indigo-500 dark:border-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600"
                          : "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
              
            </div>

            {/* Results Panel */}
            <div 
              id="panel-exclusive-inclusive"
              role="tabpanel" 
              className="p-6 sm:p-8 md:col-span-5 bg-gradient-to-b from-indigo-50/40 to-slate-50/20 dark:from-indigo-950/20 dark:to-zinc-900/30 border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800/80 flex flex-col justify-between gap-6"
            >
              
              <div className="space-y-6">
                <h3 className="text-sm font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                  Calculated Summary
                </h3>

                {/* Results Row: Base Amount */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/40 shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wide">Base Amount</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedCurrency.symbol}{formatVal(baseAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(baseAmount, "base")}
                    aria-label={`Copy base amount: ${selectedCurrency.symbol}${formatVal(baseAmount)}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title="Copy Base Amount"
                  >
                    {copiedField === "base" ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Results Row: GST Amount */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/40 shadow-sm">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wide">GST Amount</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 font-extrabold">
                        {numGstRate}%
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedCurrency.symbol}{formatVal(gstAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gstAmount, "gst")}
                    aria-label={`Copy tax amount: ${selectedCurrency.symbol}${formatVal(gstAmount)}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    title="Copy GST Amount"
                  >
                    {copiedField === "gst" ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Ratio breakdown bar */}
                <div className="space-y-2 px-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    <span>Breakdown</span>
                    <span>{basePercent.toFixed(0)}% / {gstPercent.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden flex">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300" 
                      style={{ width: `${basePercent}%` }}
                    />
                    <div 
                      className="bg-emerald-500 dark:bg-emerald-400 h-full transition-all duration-300" 
                      style={{ width: `${gstPercent}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-400 dark:text-zinc-500 font-bold justify-end uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500" /> Base
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> GST
                    </span>
                  </div>
                </div>

                {/* Final Total Box */}
                <div className="mt-4 p-4.5 rounded-2xl bg-indigo-600 text-white dark:bg-indigo-900/60 border border-indigo-500/20 shadow-md shadow-indigo-500/10 dark:shadow-none flex items-center justify-between transition-all hover:scale-[1.01]">
                  <div>
                    <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-black">
                      {selectedCurrency.symbol}{formatVal(totalAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(totalAmount, "total")}
                    aria-label={`Copy total amount: ${selectedCurrency.symbol}${formatVal(totalAmount)}`}
                    className="p-3 rounded-xl bg-indigo-700/60 dark:bg-zinc-900/60 hover:bg-indigo-800 dark:hover:bg-zinc-800/80 transition-all text-white border border-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    title="Copy Total Amount"
                  >
                    {copiedField === "total" ? (
                      <svg className="w-4.5 h-4.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
                  </button>
                </div>
                
              </div>

              {/* Action Buttons: Copy Full Summary */}
              <div className="space-y-4 pt-2">
                <button
                  onClick={copyFullSummary}
                  aria-label="Copy formatted transaction text report summary to clipboard"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-slate-50 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] shadow-sm"
                >
                  {copiedField === "summary" ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Report Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Copy Full Report
                    </>
                  )}
                </button>

                {/* Inline tax descriptions */}
                <div className="border-t border-slate-200/55 dark:border-zinc-800/60 pt-3 text-[11px] space-y-1.5 text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  <div className="flex justify-between">
                    <span>Tax Formula Type:</span>
                    <span className="text-slate-600 dark:text-zinc-300 font-bold">
                      {calculationMode === "exclusive"
                        ? "Exclusive (Add GST)"
                        : "Inclusive (Remove GST)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Base Cost:</span>
                    <span className="text-slate-600 dark:text-zinc-300 font-bold">{selectedCurrency.symbol}{formatVal(baseAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Tax Value:</span>
                    <span className="text-slate-600 dark:text-zinc-300 font-bold">{selectedCurrency.symbol}{formatVal(gstAmount)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Ledger Breakdown Table - Responsive with horizontal scroll */}
          <div className="p-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-lg overflow-hidden">
            <h4 className="text-sm font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase mb-4">
              Detailed Ledger Breakdown
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                    <th className="py-2.5 pr-2">Line Description</th>
                    <th className="py-2.5 text-right pr-2">Tax Rate</th>
                    <th className="py-2.5 text-right pr-2">Base Amount</th>
                    <th className="py-2.5 text-right pr-2">Tax Amount</th>
                    <th className="py-2.5 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-slate-600 dark:text-zinc-300 text-xs md:text-sm font-medium">
                  <tr>
                    <td className="py-3.5 pr-2">Goods / Services Base Segment</td>
                    <td className="py-3.5 text-right pr-2">0.00%</td>
                    <td className="py-3.5 text-right pr-2">{selectedCurrency.symbol}{formatVal(baseAmount)}</td>
                    <td className="py-3.5 text-right pr-2">{selectedCurrency.symbol}0.00</td>
                    <td className="py-3.5 text-right">{selectedCurrency.symbol}{formatVal(baseAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-2">Goods & Services Tax (GST) Segment</td>
                    <td className="py-3.5 text-right pr-2">{numGstRate.toFixed(2)}%</td>
                    <td className="py-3.5 text-right pr-2">{selectedCurrency.symbol}{formatVal(baseAmount)}</td>
                    <td className="py-3.5 text-right pr-2">{selectedCurrency.symbol}{formatVal(gstAmount)}</td>
                    <td className="py-3.5 text-right">{selectedCurrency.symbol}{formatVal(gstAmount)}</td>
                  </tr>
                  <tr className="font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-zinc-700">
                    <td className="py-3.5 pr-2">Cumulative Net Total</td>
                    <td className="py-3.5 text-right pr-2">—</td>
                    <td className="py-3.5 text-right pr-2">{selectedCurrency.symbol}{formatVal(baseAmount)}</td>
                    <td className="py-3.5 text-right pr-2">{selectedCurrency.symbol}{formatVal(gstAmount)}</td>
                    <td className="py-3.5 text-right text-indigo-600 dark:text-indigo-400">
                      {selectedCurrency.symbol}{formatVal(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 border-t border-slate-200/55 dark:border-zinc-800/60 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-[10px] md:text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
        <div className="space-y-1">
          <p className="text-slate-500 dark:text-zinc-300">
            Portfolio Developer: <span className="text-slate-900 dark:text-white font-extrabold">Saksham Joshi</span>
          </p>
          <p className="text-slate-400 dark:text-zinc-400 font-medium normal-case tracking-normal">
            Email:{" "}
            <a
              href="mailto:saksham.joshi08052006@gmail.com"
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold underline underline-offset-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
            >
              saksham.joshi08052006@gmail.com
            </a>
          </p>
        </div>

        <div>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-md shadow-indigo-100 dark:shadow-none hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 hover:scale-[1.03] active:scale-[0.97] border border-indigo-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Built for Digital Heroes
            <svg
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

