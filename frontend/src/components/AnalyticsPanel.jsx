import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const READABILITY_STYLES = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-blue-100 text-blue-700",
  Hard: "bg-amber-100 text-amber-700",
  "Very Hard": "bg-red-100 text-red-700",
};

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function AnalyticsPanel({ fetchAnalytics }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchAnalytics()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load analytics");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Analyzing document...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const chartData = data.top_words;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Words" value={data.word_count.toLocaleString()} />
        <StatCard label="Sentences" value={data.sentence_count.toLocaleString()} />
        <StatCard label="Reading Time" value={`${data.reading_time_minutes} min`} />
        <StatCard label="Complexity Score" value={data.readability_score} />
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Readability
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              READABILITY_STYLES[data.readability_label] || "bg-gray-100 text-gray-600"
            }`}
          >
            {data.readability_label}
          </span>
          <span className="text-xs text-gray-400">
            ~{data.avg_words_per_sentence} words/sentence
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Based on sentence and word complexity. Professional documents (contracts, reports,
          job descriptions) naturally score lower than casual writing — this is expected.
        </p>
      </div>

      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Top Words
      </h4>
      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400">Not enough text to determine top words.</p>
      ) : (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="word" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
