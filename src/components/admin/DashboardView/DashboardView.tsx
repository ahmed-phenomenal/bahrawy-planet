import Link from "next/link";
import { ArrowRight, BookOpen, Eye, UserCheck, Users } from "lucide-react";
import "./DashboardView.css";

export type DashboardData = {
  stats: {
    total_books: number;
    active_offers: number;
    upcoming_events: number;
    employees: number;
    present_today: number;
  };
  category_views: { name: string; views: number }[];
  feedback: {
    count: number;
    average_rating: number;
    recent: { id: number; name: string; rating: number; message: string }[];
  };
};

export default function DashboardView({ data }: { data: DashboardData | null }) {
  if (!data) {
    return (
      <>
        <h1 className="adm-page-title">Dashboard</h1>
        <div className="adm-card">
          Could not load the dashboard. Make sure the backend is running
          (php artisan serve) and try again.
        </div>
      </>
    );
  }

  const { stats, category_views: categoryViews, feedback } = data;

  // Math.max(1, ...) so the bars never divide by zero when nobody viewed a book yet
  const maxViews = Math.max(1, ...categoryViews.map((c) => c.views));
  const totalViews = categoryViews.reduce((sum, c) => sum + c.views, 0);

  const cards = [
    { label: "Total Books", value: stats.total_books, icon: BookOpen },
    { label: "Employees", value: stats.employees, icon: Users },
    {
      label: "Staff Present Today",
      value: `${stats.present_today}/${stats.employees}`,
      icon: UserCheck,
    },
    {
      label: "Book Views",
      value: totalViews.toLocaleString("en-US"),
      icon: Eye,
    },
  ];

  return (
    <>
      <h1 className="adm-page-title">Dashboard</h1>
      <p className="adm-page-sub">A quick look at how your store is doing.</p>

      <div className="dash-stats">
        {cards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="adm-card dash-stat">
              <div className="dash-stat-icon">
                <Icon size={26} />
              </div>
              <div>
                <p className="dash-stat-label">{s.label}</p>
                <p className="dash-stat-value">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dash-grid">
        <div className="adm-card">
          <h2 className="adm-card-title">Category Views Analytics</h2>
          <p className="dash-total">
            {totalViews.toLocaleString("en-US")} book page views in total (each
            visitor browser is counted once per book)
          </p>

          <div className="dash-bars">
            {categoryViews.map((c) => (
              <div key={c.name} className="dash-bar-row">
                <div className="dash-bar-head">
                  <span>{c.name}</span>
                  <strong>{c.views.toLocaleString("en-US")}</strong>
                </div>
                <div className="dash-bar-track">
                  <div
                    className="dash-bar-fill"
                    style={{ width: `${(c.views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">Recent Feedback</h2>
          <p className="dash-total">
            {feedback.count} messages · Average rating {feedback.average_rating.toFixed(1)} / 5
          </p>

          {feedback.recent.length === 0 ? (
            <p className="dash-total">No feedback yet.</p>
          ) : (
            <ul className="dash-feedback">
              {feedback.recent.map((f) => (
                <li key={f.id}>
                  <div className="dash-feedback-head">
                    <strong>{f.name}</strong>
                    <span className="dash-stars">
                      {"★".repeat(Math.min(5, Math.max(0, Math.round(f.rating))))}
                    </span>
                  </div>
                  <p>{f.message}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="dash-more">
            <Link href="/admin/feedback" className="dash-link">
              View all feedback
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}