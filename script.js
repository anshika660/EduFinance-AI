let loanChart;
let incomeChart;
let expenseChart;

function calculateEMI() {

    const P = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const years = parseFloat(document.getElementById("loanTenure").value);

    if (!P || !annualRate || !years) {
        alert("Please fill all EMI fields");
        return;
    }

    const r = annualRate / 12 / 100;
    const n = years * 12;

    const EMI =
        (P * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1);

    const totalPayment = EMI * n;
    const totalInterest = totalPayment - P;

    document.getElementById("emi").innerText =
        "₹" + EMI.toFixed(0);

    document.getElementById("interest").innerText =
        "₹" + totalInterest.toFixed(0);

    document.getElementById("payment").innerText =
        "₹" + totalPayment.toFixed(0);

    document.getElementById("heroEMI").innerText =
        "₹" + EMI.toFixed(0);

    document.getElementById("statEMI").innerText =
        "₹" + EMI.toFixed(0);

    updateLoanChart(P, totalInterest);
    updateIncomeChart(EMI);

    saveHistory(
        `Loan ₹${P.toLocaleString()} | EMI ₹${EMI.toFixed(0)}`
    );

    generateAIAdvice(
        EMI,
        totalInterest
    );
}

function calculateSavings() {

    const target =
        parseFloat(document.getElementById("targetAmount").value);

    const months =
        parseFloat(document.getElementById("targetMonths").value);

    if (!target || !months) {
        alert("Enter savings goal details");
        return;
    }

    const monthly = target / months;

    document.getElementById("savingResult").innerText =
        "₹" + monthly.toFixed(0) + "/month";

    document.getElementById("heroSavings").innerText =
        "₹" + target.toLocaleString();

    document.getElementById("statSavings").innerText =
        "₹" + target.toLocaleString();
}

function calculateBudget() {

    const income =
        parseFloat(document.getElementById("monthlyIncome").value) || 0;

    const rent =
        parseFloat(document.getElementById("rent").value) || 0;

    const food =
        parseFloat(document.getElementById("food").value) || 0;

    const transport =
        parseFloat(document.getElementById("transport").value) || 0;

    const other =
        parseFloat(document.getElementById("otherExpenses").value) || 0;

    const totalExpenses =
        rent + food + transport + other;

    const remaining =
        income - totalExpenses;

    document.getElementById("budgetResult").innerHTML =
        `
        <h3>Remaining Balance</h3>
        <h2>₹${remaining.toFixed(0)}</h2>
        `;

    updateExpenseChart(
        rent,
        food,
        transport,
        other
    );

    updateFinancialHealth(
        income,
        remaining
    );
    const emiText =
document.getElementById("emi").innerText
.replace("₹","");
updateIncomeChart(
    parseFloat(emiText) || 0
);

generateAIAdvice(
    parseFloat(emiText) || 0,
    0
);
}

function updateFinancialHealth(
    income,
    remaining
) {

    if (income <= 0) return;

    let score =
        Math.max(
            0,
            Math.min(
                100,
                (remaining / income) * 100
            )
        );

    document.getElementById("healthScore").innerText =
        score.toFixed(0) + "%";

    let risk = "High";

 if (score >= 70) {
    risk = "Low";
}
else if (score >= 30) {
    risk = "Medium";
}
else {
    risk = "High";
}

    document.getElementById("riskLevel").innerText =
        risk;

    document.getElementById("affordabilityScore").innerText =
        score.toFixed(0) + "/100";
}

function generateAIAdvice(
    emi,
    interest
) {

    const income =
        parseFloat(
            document.getElementById("monthlyIncome").value
        ) || 0;

    let advice =
        "Enter income details for deeper recommendations.";

    if (income > 0) {

        const ratio =
            (emi / income) * 100;

        if (ratio < 20) {

            advice = `
Financial Analysis

✓ EMI consumes only ${ratio.toFixed(1)}% of your income

✓ Loan appears affordable

✓ Savings potential is high

Recommendation:
Consider investing surplus funds into SIPs or emergency savings.
            `;

        }

        else if (ratio < 40) {

            advice = `
Financial Analysis

✓ EMI is manageable

✓ Monthly finances appear stable

✓ Maintain an emergency fund

Recommendation:
Avoid taking additional debt until this loan is reduced.
            `;

        }

        else {

            advice = `
Financial Analysis

⚠ EMI burden is high

⚠ Loan may impact future savings

⚠ Financial risk is elevated

Recommendation:
Reduce the loan amount or increase the repayment tenure.
            `;

        }
    }

    document.getElementById("aiAdvice").innerText =
        advice;
}
function updateLoanChart(
    principal,
    interest
) {

    const ctx =
        document.getElementById("loanChart");

    if (!ctx) return;

    if (loanChart) {
        loanChart.destroy();
    }

    loanChart =
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: [
                    "Principal",
                    "Interest"
                ],
                datasets: [{
                    data: [
                        principal,
                        interest
                    ]
                }]
            }
        });
}

function updateIncomeChart(
    emi
) {

    const income =
        parseFloat(document.getElementById("monthlyIncome").value) || 0;

    const ctx =
        document.getElementById("incomeChart");

    if (!ctx) return;

    if (incomeChart) {
        incomeChart.destroy();
    }

    incomeChart =
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: [
                    "Income",
                    "EMI"
                ],
                datasets: [{
                    data: [
                        income,
                        emi
                    ]
                }]
            }
        });
}

function updateExpenseChart(
    rent,
    food,
    transport,
    other
) {

    const ctx =
        document.getElementById("expenseChart");

    if (!ctx) return;

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart =
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: [
                    "Rent",
                    "Food",
                    "Transport",
                    "Other"
                ],
                datasets: [{
                    data: [
                        rent,
                        food,
                        transport,
                        other
                    ]
                }]
            }
        });
}

function saveHistory(text) {

    let history =
        JSON.parse(
            localStorage.getItem("financeHistory")
        ) || [];

    history.unshift(text);

    history =
        history.slice(0, 5);

    localStorage.setItem(
        "financeHistory",
        JSON.stringify(history)
    );

    loadHistory();
}

function loadHistory() {

    const list =
        document.getElementById("historyList");

    const history =
        JSON.parse(
            localStorage.getItem("financeHistory")
        ) || [];

    if (history.length === 0) return;

    list.innerHTML = "";

    history.forEach(item => {

        const li =
            document.createElement("li");

        li.innerText = item;

        list.appendChild(li);
    });
}

function downloadPDF() {

    html2pdf()
        .set({
            margin: 10,
            filename: "EduFinanceAI_Report.pdf",
            image: {
                type: "jpeg",
                quality: 1
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        })
        .from(document.body)
        .save();
}

document
.getElementById("themeToggle")
.addEventListener("click", () => {

    document.body.classList.toggle("light");
});

loadHistory();