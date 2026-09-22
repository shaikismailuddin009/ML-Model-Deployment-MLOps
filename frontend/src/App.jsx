import { useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Gauge,
  Home,
  RotateCcw,
  Server,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Wifi,
  XCircle,
} from "lucide-react";

import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const initialForm = {
  gender: "Male",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "No",
  tenure: 12,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "DSL",
  OnlineSecurity: "No",
  OnlineBackup: "Yes",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "No",
  StreamingMovies: "No",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 55.5,
  TotalCharges: 666.0,
};

function App() {
  const [page, setPage] = useState("dashboard");
  const [form, setForm] = useState(initialForm);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    checkApiHealth();
  }, []);

  async function checkApiHealth() {
    setApiStatus("checking");

    try {
      const response = await fetch(`${API_URL}/health`);

      if (!response.ok) {
        throw new Error("API health check failed");
      }

      const data = await response.json();

      if (data.status === "healthy") {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch {
      setApiStatus("offline");
    }
  }

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  }

  function resetForm() {
    setForm(initialForm);
    setPrediction(null);
    setError("");
  }

  async function handlePrediction(event) {
    event.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          SeniorCitizen: Number(form.SeniorCitizen),
          tenure: Number(form.tenure),
          MonthlyCharges: Number(form.MonthlyCharges),
          TotalCharges: Number(form.TotalCharges),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction request failed."
        );
      }

      setPrediction(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the prediction API."
      );
    } finally {
      setLoading(false);
    }
  }

  function navigate(target) {
    setPage(target);
    setError("");
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        navigate={navigate}
        apiStatus={apiStatus}
      />

      <main className="main-content">
        <TopBar
          page={page}
          apiStatus={apiStatus}
          checkApiHealth={checkApiHealth}
        />

        {page === "dashboard" && (
          <Dashboard
            navigate={navigate}
            apiStatus={apiStatus}
          />
        )}

        {page === "predict" && (
          <PredictionPage
            form={form}
            updateField={updateField}
            resetForm={resetForm}
            prediction={prediction}
            loading={loading}
            error={error}
            onSubmit={handlePrediction}
            navigate={navigate}
          />
        )}

        {page === "performance" && (
          <PerformancePage />
        )}

        {page === "status" && (
          <StatusPage
            apiStatus={apiStatus}
            checkApiHealth={checkApiHealth}
          />
        )}
      </main>
    </div>
  );
}


/* =========================
   SIDEBAR
========================= */

function Sidebar({ page, navigate, apiStatus }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <BrainCircuit size={22} />
        </div>

        <div>
          <h1>ChurnIQ</h1>
          <span>ML Intelligence</span>
        </div>
      </div>

      <nav className="navigation">
        <button
          className={`nav-item ${
            page === "dashboard" ? "active" : ""
          }`}
          onClick={() => navigate("dashboard")}
        >
          <Home size={18} />
          Dashboard
        </button>

        <button
          className={`nav-item ${
            page === "predict" ? "active" : ""
          }`}
          onClick={() => navigate("predict")}
        >
          <Sparkles size={18} />
          Predict Churn
        </button>

        <button
          className={`nav-item ${
            page === "performance" ? "active" : ""
          }`}
          onClick={() => navigate("performance")}
        >
          <BarChart3 size={18} />
          Model Performance
        </button>

        <button
          className={`nav-item ${
            page === "status" ? "active" : ""
          }`}
          onClick={() => navigate("status")}
        >
          <Activity size={18} />
          API Status
        </button>
      </nav>

      <div className="sidebar-footer">
        <StatusIndicator status={apiStatus} />

        <div>
          <strong>
            {apiStatus === "online"
              ? "System Online"
              : apiStatus === "checking"
              ? "Checking API"
              : "API Offline"}
          </strong>

          <span>
            {apiStatus === "online"
              ? "Prediction API ready"
              : "Backend unavailable"}
          </span>
        </div>
      </div>
    </aside>
  );
}


/* =========================
   TOP BAR
========================= */

function TopBar({
  page,
  apiStatus,
  checkApiHealth,
}) {
  const titles = {
    dashboard: [
      "CUSTOMER ANALYTICS",
      "Customer Churn Intelligence",
      "Monitor the deployed machine-learning system.",
    ],
    predict: [
      "CHURN PREDICTION",
      "Predict Customer Churn",
      "Submit customer information to the trained ML pipeline.",
    ],
    performance: [
      "MODEL PERFORMANCE",
      "Model Performance",
      "Evaluation metrics from the held-out test set.",
    ],
    status: [
      "SYSTEM STATUS",
      "API & System Status",
      "Monitor the availability of the prediction service.",
    ],
  };

  const current = titles[page];

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{current[0]}</p>

        <h2>{current[1]}</h2>

        <p className="subtitle">{current[2]}</p>
      </div>

      <button
        className="api-status clickable"
        onClick={checkApiHealth}
        title="Refresh API status"
      >
        <StatusIndicator status={apiStatus} />

        {apiStatus === "online"
          ? "API Online"
          : apiStatus === "checking"
          ? "Checking..."
          : "API Offline"}
      </button>
    </header>
  );
}


/* =========================
   DASHBOARD
========================= */

function Dashboard({ navigate, apiStatus }) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-icon">
            <Sparkles size={25} />
          </div>

          <div>
            <p className="hero-label">
              AI-POWERED PREDICTION
            </p>

            <h3>
              Identify potential customer churn
            </h3>

            <p>
              Use the deployed machine-learning pipeline
              to evaluate customer information and generate
              a churn prediction through FastAPI.
            </p>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("predict")}
        >
          Start Prediction
          <ChevronRight size={18} />
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          icon={<Gauge size={20} />}
          label="Model Accuracy"
          value="80.55%"
        />

        <StatCard
          icon={<BrainCircuit size={20} />}
          label="Model"
          value="Logistic Regression"
        />

        <StatCard
          icon={<Users size={20} />}
          label="Test Samples"
          value="1,409"
        />

        <StatCard
          icon={<ShieldCheck size={20} />}
          label="API Status"
          value={
            apiStatus === "online"
              ? "Healthy"
              : apiStatus === "checking"
              ? "Checking"
              : "Offline"
          }
          className={
            apiStatus === "online"
              ? "online-text"
              : ""
          }
        />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-label">
                DEPLOYMENT PIPELINE
              </span>

              <h3>How ChurnIQ works</h3>
            </div>
          </div>

          <div className="pipeline">
            <PipelineStep
              number="01"
              title="Customer Data"
              description="Customer and subscription information"
            />

            <div className="pipeline-line"></div>

            <PipelineStep
              number="02"
              title="Preprocessing"
              description="Encoding, imputation and feature scaling"
            />

            <div className="pipeline-line"></div>

            <PipelineStep
              number="03"
              title="ML Model"
              description="Logistic Regression inference"
            />

            <div className="pipeline-line"></div>

            <PipelineStep
              number="04"
              title="Prediction"
              description="Churn result returned through FastAPI"
            />
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="section-label">
                QUICK METRICS
              </span>

              <h3>Model evaluation</h3>
            </div>
          </div>

          <MetricRow
            label="Accuracy"
            value="80.55%"
          />

          <MetricRow
            label="Precision"
            value="65.72%"
          />

          <MetricRow
            label="Recall"
            value="55.88%"
          />

          <MetricRow
            label="F1 Score"
            value="60.40%"
          />

          <button
            className="panel-link"
            onClick={() => navigate("performance")}
          >
            View full model performance
            <ChevronRight size={15} />
          </button>
        </div>
      </section>
    </>
  );
}


/* =========================
   PREDICTION PAGE
========================= */

function PredictionPage({
  form,
  updateField,
  resetForm,
  prediction,
  loading,
  error,
  onSubmit,
  navigate,
}) {
  return (
    <section className="prediction-page">
      <form
        className="prediction-card"
        onSubmit={onSubmit}
      >
        <FormSection
          icon={<UserRound size={18} />}
          title="Customer Profile"
          description="Basic customer information"
        >
          <div className="form-grid">
            <SelectField
              label="Gender"
              value={form.gender}
              onChange={(value) =>
                updateField("gender", value)
              }
              options={["Male", "Female"]}
            />

            <SelectField
              label="Senior Citizen"
              value={String(form.SeniorCitizen)}
              onChange={(value) =>
                updateField(
                  "SeniorCitizen",
                  Number(value)
                )
              }
              options={[
                ["0", "No"],
                ["1", "Yes"],
              ]}
            />

            <SelectField
              label="Partner"
              value={form.Partner}
              onChange={(value) =>
                updateField("Partner", value)
              }
              options={["Yes", "No"]}
            />

            <SelectField
              label="Dependents"
              value={form.Dependents}
              onChange={(value) =>
                updateField("Dependents", value)
              }
              options={["Yes", "No"]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<Wifi size={18} />}
          title="Services"
          description="Services currently used by the customer"
        >
          <div className="form-grid">
            <SelectField
              label="Phone Service"
              value={form.PhoneService}
              onChange={(value) =>
                updateField("PhoneService", value)
              }
              options={["Yes", "No"]}
            />

            <SelectField
              label="Multiple Lines"
              value={form.MultipleLines}
              onChange={(value) =>
                updateField("MultipleLines", value)
              }
              options={[
                "Yes",
                "No",
                "No phone service",
              ]}
            />

            <SelectField
              label="Internet Service"
              value={form.InternetService}
              onChange={(value) =>
                updateField(
                  "InternetService",
                  value
                )
              }
              options={[
                "DSL",
                "Fiber optic",
                "No",
              ]}
            />

            <SelectField
              label="Online Security"
              value={form.OnlineSecurity}
              onChange={(value) =>
                updateField(
                  "OnlineSecurity",
                  value
                )
              }
              options={[
                "Yes",
                "No",
                "No internet service",
              ]}
            />

            <SelectField
              label="Online Backup"
              value={form.OnlineBackup}
              onChange={(value) =>
                updateField(
                  "OnlineBackup",
                  value
                )
              }
              options={[
                "Yes",
                "No",
                "No internet service",
              ]}
            />

            <SelectField
              label="Device Protection"
              value={form.DeviceProtection}
              onChange={(value) =>
                updateField(
                  "DeviceProtection",
                  value
                )
              }
              options={[
                "Yes",
                "No",
                "No internet service",
              ]}
            />

            <SelectField
              label="Tech Support"
              value={form.TechSupport}
              onChange={(value) =>
                updateField(
                  "TechSupport",
                  value
                )
              }
              options={[
                "Yes",
                "No",
                "No internet service",
              ]}
            />

            <SelectField
              label="Streaming TV"
              value={form.StreamingTV}
              onChange={(value) =>
                updateField(
                  "StreamingTV",
                  value
                )
              }
              options={[
                "Yes",
                "No",
                "No internet service",
              ]}
            />

            <SelectField
              label="Streaming Movies"
              value={form.StreamingMovies}
              onChange={(value) =>
                updateField(
                  "StreamingMovies",
                  value
                )
              }
              options={[
                "Yes",
                "No",
                "No internet service",
              ]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<Activity size={18} />}
          title="Account & Subscription"
          description="Contract and customer account details"
        >
          <div className="form-grid">
            <InputField
              label="Tenure (months)"
              type="number"
              value={form.tenure}
              min="0"
              onChange={(value) =>
                updateField("tenure", value)
              }
            />

            <SelectField
              label="Contract"
              value={form.Contract}
              onChange={(value) =>
                updateField("Contract", value)
              }
              options={[
                "Month-to-month",
                "One year",
                "Two year",
              ]}
            />

            <SelectField
              label="Paperless Billing"
              value={form.PaperlessBilling}
              onChange={(value) =>
                updateField(
                  "PaperlessBilling",
                  value
                )
              }
              options={["Yes", "No"]}
            />

            <SelectField
              label="Payment Method"
              value={form.PaymentMethod}
              onChange={(value) =>
                updateField(
                  "PaymentMethod",
                  value
                )
              }
              options={[
                "Electronic check",
                "Mailed check",
                "Bank transfer (automatic)",
                "Credit card (automatic)",
              ]}
            />
          </div>
        </FormSection>

        <FormSection
          icon={<CircleGauge size={18} />}
          title="Billing"
          description="Customer billing information"
        >
          <div className="form-grid">
            <InputField
              label="Monthly Charges"
              type="number"
              value={form.MonthlyCharges}
              min="0"
              step="0.01"
              onChange={(value) =>
                updateField(
                  "MonthlyCharges",
                  value
                )
              }
            />

            <InputField
              label="Total Charges"
              type="number"
              value={form.TotalCharges}
              min="0"
              step="0.01"
              onChange={(value) =>
                updateField(
                  "TotalCharges",
                  value
                )
              }
            />
          </div>
        </FormSection>

        {error && (
          <div className="error-box">
            <AlertCircle size={18} />

            <div>
              <strong>Prediction failed</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {prediction && (
          <PredictionResult
            prediction={prediction}
          />
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("dashboard")}
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={resetForm}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Predicting...
              </>
            ) : (
              <>
                Predict Churn
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}


/* =========================
   PREDICTION RESULT
========================= */

function PredictionResult({ prediction }) {
  const isChurn = prediction.prediction === 1;

  return (
    <div
      className={`prediction-result ${
        isChurn ? "risk" : "safe"
      }`}
    >
      <div className="result-icon">
        {isChurn ? (
          <AlertCircle size={26} />
        ) : (
          <CheckCircle2 size={26} />
        )}
      </div>

      <div className="result-content">
        <span className="result-label">
          MODEL PREDICTION
        </span>

        <h3>
          {prediction.result}
        </h3>

        <p>
          Prediction value:{" "}
          <strong>{prediction.prediction}</strong>
        </p>
      </div>
    </div>
  );
}


/* =========================
   PERFORMANCE PAGE
========================= */

function PerformancePage() {
  return (
    <section className="page-section">
      <div className="performance-hero">
        <div className="large-icon">
          <BarChart3 size={25} />
        </div>

        <div>
          <span className="section-label">
            LOGISTIC REGRESSION
          </span>

          <h3>Model Evaluation</h3>

          <p>
            Evaluation results calculated using the
            held-out test dataset.
          </p>
        </div>
      </div>

      <div className="performance-grid">
        <PerformanceCard
          label="Accuracy"
          value="80.55%"
          description="Overall correct predictions"
        />

        <PerformanceCard
          label="Precision"
          value="65.72%"
          description="Precision for churn predictions"
        />

        <PerformanceCard
          label="Recall"
          value="55.88%"
          description="Churn cases identified"
        />

        <PerformanceCard
          label="F1 Score"
          value="60.40%"
          description="Balance of precision and recall"
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="section-label">
            CONFUSION MATRIX
          </span>

          <h3>Test-set results</h3>
        </div>

        <div className="confusion-grid">
          <div>
            <span>True Negative</span>
            <strong>926</strong>
          </div>

          <div>
            <span>False Positive</span>
            <strong>109</strong>
          </div>

          <div>
            <span>False Negative</span>
            <strong>165</strong>
          </div>

          <div>
            <span>True Positive</span>
            <strong>209</strong>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =========================
   STATUS PAGE
========================= */

function StatusPage({
  apiStatus,
  checkApiHealth,
}) {
  return (
    <section className="page-section">
      <div className="status-overview">
        <div className="large-icon">
          <Server size={25} />
        </div>

        <div>
          <span className="section-label">
            BACKEND MONITORING
          </span>

          <h3>FastAPI Service</h3>

          <p>
            Live health status from the deployed backend
            service.
          </p>
        </div>
      </div>

      <div className="status-grid">
        <div className="status-card">
          <div className="status-card-icon">
            <Server size={20} />
          </div>

          <div>
            <span>API Service</span>

            <strong>
              {apiStatus === "online"
                ? "Online"
                : apiStatus === "checking"
                ? "Checking..."
                : "Offline"}
            </strong>
          </div>

          <StatusIndicator status={apiStatus} />
        </div>

        <div className="status-card">
          <div className="status-card-icon">
            <BrainCircuit size={20} />
          </div>

          <div>
            <span>ML Pipeline</span>
            <strong>Loaded</strong>
          </div>

          <CheckCircle2
            size={19}
            className="success-icon"
          />
        </div>

        <div className="status-card">
          <div className="status-card-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <span>Prediction Endpoint</span>
            <strong>/predict</strong>
          </div>

          <CheckCircle2
            size={19}
            className="success-icon"
          />
        </div>
      </div>

      <div className="panel endpoint-panel">
        <span className="section-label">
          API ENDPOINTS
        </span>

        <h3>Available services</h3>

        <div className="endpoint-row">
          <span className="method get">GET</span>
          <code>/</code>
          <span>API information</span>
        </div>

        <div className="endpoint-row">
          <span className="method get">GET</span>
          <code>/health</code>
          <span>Health check</span>
        </div>

        <div className="endpoint-row">
          <span className="method post">POST</span>
          <code>/predict</code>
          <span>Churn prediction</span>
        </div>

        <button
          className="primary-button refresh-button"
          onClick={checkApiHealth}
        >
          <Activity size={17} />
          Refresh API Status
        </button>
      </div>
    </section>
  );
}


/* =========================
   REUSABLE COMPONENTS
========================= */

function StatCard({
  icon,
  label,
  value,
  className = "",
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong className={className}>
          {value}
        </strong>
      </div>
    </div>
  );
}


function PipelineStep({
  number,
  title,
  description,
}) {
  return (
    <div className="pipeline-step">
      <span>{number}</span>

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}


function MetricRow({ label, value }) {
  return (
    <div className="metric-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <div className="form-section">
      <div className="form-section-title">
        {icon}

        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      {children}
    </div>
  );
}


function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label>
      {label}

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => {
          const optionValue = Array.isArray(option)
            ? option[0]
            : option;

          const optionLabel = Array.isArray(option)
            ? option[1]
            : option;

          return (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}


function InputField({
  label,
  type,
  value,
  onChange,
  min,
  step,
}) {
  return (
    <label>
      {label}

      <input
        type={type}
        value={value}
        min={min}
        step={step}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}


function PerformanceCard({
  label,
  value,
  description,
}) {
  return (
    <div className="performance-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </div>
  );
}


function StatusIndicator({ status }) {
  return (
    <span
      className={`status-indicator ${status}`}
    ></span>
  );
}

export default App;