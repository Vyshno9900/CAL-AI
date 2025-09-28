import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [form, setForm] = useState({ age: 25, sex: "male", weight: 70, height: 175, goal: "maintain" });
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setPlan([]);
    try {
      const res = await fetch("/api/gemini-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setPlan(data.foodPlan || []);
    } catch (err) {
      alert("Error fetching plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Vyshno Calorie Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input name="age" placeholder="Age" value={form.age} onChange={onChange} />
        <input name="weight" placeholder="Weight kg" value={form.weight} onChange={onChange} />
        <input name="height" placeholder="Height cm" value={form.height} onChange={onChange} />
        <select name="sex" value={form.sex} onChange={onChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select name="goal" value={form.goal} onChange={onChange}>
          <option value="maintain">Maintain</option>
          <option value="bulk">Bulk</option>
          <option value="cut">Cut</option>
        </select>
        <button type="submit">{loading ? "Loading..." : "Get Plan"}</button>
      </form>
      {plan.length > 0 && (
        <div>
          <h2>Meal Plan</h2>
          <ul>{plan.map((item,i) => <li key={i}>{item}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
