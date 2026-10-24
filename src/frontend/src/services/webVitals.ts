import { onCLS, onINP, onLCP } from "web-vitals/attribution";
import type {
  CLSMetricWithAttribution,
  INPMetricWithAttribution,
  LCPMetricWithAttribution,
} from "web-vitals/attribution";

type MetricWithAttribution = CLSMetricWithAttribution | INPMetricWithAttribution | LCPMetricWithAttribution;

// The element a metric blames: the one that shifted most (CLS), was interacted with (INP) or painted largest (LCP).
// Missing when the browser gave no entry to blame.
function debugTarget(metric: MetricWithAttribution): string | undefined {
  switch (metric.name) {
    case "CLS":
      return metric.attribution.largestShiftTarget;
    case "INP":
      return metric.attribution.interactionTarget;
    case "LCP":
      return metric.attribution.target;
  }
}

// Milliseconds after the page load at which the blamed thing happened, to tell load-time shifts from later ones.
function debugTime(metric: MetricWithAttribution): number | undefined {
  switch (metric.name) {
    case "CLS":
      return metric.attribution.largestShiftTime;
    case "INP":
      return metric.attribution.interactionTime;
    case "LCP":
      return metric.entries.at(-1)?.startTime;
  }
}

// Sent the way Google recommends for GA4: events summed by metric_id give each page view's value. CLS is scaled up,
// because GA4 stores event values as integers.
function sendToAnalytics(metric: MetricWithAttribution) {
  gtag("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    debug_target: debugTarget(metric),
    debug_time: debugTime(metric),
    non_interaction: true,
  });
}

// Reports the Core Web Vitals of real visits to Google Analytics, with the element responsible for each.
export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
}
