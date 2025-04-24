import { ChartOptions } from "chart.js";
import { COLORS } from "../constants";

export const lineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: COLORS.gridLine,
        display: false,
      },
      ticks: {
        color: COLORS.textColor,
      },
    },
    y: {
      type: "linear",
      beginAtZero: true,
      grid: {
        color: COLORS.gridLine,
        display: false,
      },
      ticks: {
        color: COLORS.textColor,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
      displayColors: false,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: COLORS.primary,
      bodyColor: COLORS.textColor,
      padding: 12,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        },
      },
    },
    zoom: {
      pan: {
        enabled: true,
        mode: "xy",
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy",
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hoverRadius: 5,
      backgroundColor: COLORS.primary,
      borderWidth: 2,
      borderColor: "#ffffff",
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

export const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: COLORS.gridLine,
        display: false,
      },
      ticks: {
        color: COLORS.textColor,
      },
    },
    y: {
      type: "linear",
      beginAtZero: true,
      grid: {
        color: COLORS.gridLine,
        display: false,
      },
      ticks: {
        color: COLORS.textColor,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
      displayColors: false,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: COLORS.primary,
      bodyColor: COLORS.textColor,
      padding: 12,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        },
      },
    },
  },
};
