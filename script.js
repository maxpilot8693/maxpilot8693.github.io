// Currency Converter JavaScript
class CurrencyConverter {
    constructor() {
        this.apiUrl = 'https://api.exchangerate-api.com/v4/latest/';
        this.rates = {};
        this.lastUpdated = null;
        this.init();
    }

    async init() {
        await this.fetchRates();
        this.setupEventListeners();
        this.updateUI();
    }

    async fetchRates() {
        try {
            // Fetch USD as base currency
            const response = await fetch(`${this.apiUrl}USD`);
            const data = await response.json();
            
            if (data && data.rates) {
                this.rates = data.rates;
                this.lastUpdated = new Date(data.date);
                console.log('Exchange rates fetched successfully');
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            // Fallback rates for demo purposes
            this.rates = {
                USD: 1,
                EUR: 0.85,
                GBP: 0.73,
                KES: 150.25,
                JPY: 110.50,
                AUD: 1.35,
                CAD: 1.25,
                CHF: 0.92,
                CNY: 6.45
            };
            this.lastUpdated = new Date();
        }
    }

    setupEventListeners() {
        // Main converter
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        const fromAmount = document.getElementById('from-amount');
        const swapBtn = document.getElementById('swap-currencies');

        if (fromAmount) {
            fromAmount.addEventListener('input', () => this.convertCurrency());
        }

        if (fromCurrency) {
            fromCurrency.addEventListener('change', () => this.convertCurrency());
        }

        if (toCurrency) {
            toCurrency.addEventListener('change', () => this.convertCurrency());
        }

        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.swapCurrencies());
        }

        // Page-specific converters
        this.setupPageSpecificListeners();
    }

    setupPageSpecificListeners() {
        // USD to KES page
        const usdInput = document.getElementById('usd-input');
        if (usdInput) {
            usdInput.addEventListener('input', () => this.convertUSDToKES());
        }

        // EUR to KES page
        const eurInput = document.getElementById('eur-input');
        if (eurInput) {
            eurInput.addEventListener('input', () => this.convertEURToKES());
        }

        // GBP to KES page
        const gbpInput = document.getElementById('gbp-input');
        if (gbpInput) {
            gbpInput.addEventListener('input', () => this.convertGBPToKES());
        }
    }

    convertCurrency() {
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');
        const fromAmount = document.getElementById('from-amount');
        const toAmount = document.getElementById('to-amount');
        const resultDisplay = document.getElementById('conversion-result');

        if (!fromCurrency || !toCurrency || !fromAmount || !toAmount) return;

        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amount = parseFloat(fromAmount.value) || 0;

        if (amount === 0) {
            toAmount.value = '';
            if (resultDisplay) {
                resultDisplay.textContent = 'Enter an amount to see the conversion';
            }
            return;
        }

        const result = this.calculate(from, to, amount);
        toAmount.value = this.formatAmount(result);

        if (resultDisplay) {
            const rate = this.calculate(from, to, 1);
            resultDisplay.innerHTML = `${this.formatAmount(amount)} ${from} = ${this.formatAmount(result)} ${to}<br><small>1 ${from} = ${this.formatAmount(rate)} ${to}</small>`;
        }
    }

    convertUSDToKES() {
        const usdInput = document.getElementById('usd-input');
        const kesOutput = document.getElementById('kes-output');
        const conversionDisplay = document.getElementById('conversion-display');
        const rateDisplay = document.getElementById('rate-display');

        if (!usdInput || !kesOutput) return;

        const usdAmount = parseFloat(usdInput.value) || 0;
        const kesAmount = this.calculate('USD', 'KES', usdAmount);
        const rate = this.calculate('USD', 'KES', 1);

        kesOutput.value = usdAmount > 0 ? this.formatAmount(kesAmount) : '';
        
        if (rateDisplay) {
            rateDisplay.textContent = this.formatAmount(rate);
        }

        if (conversionDisplay) {
            conversionDisplay.innerHTML = `1 USD = ${this.formatAmount(rate)} KES`;
        }

        // Update conversion table
        this.updateConversionTable('USD', 'KES');
    }

    convertEURToKES() {
        const eurInput = document.getElementById('eur-input');
        const kesOutput = document.getElementById('kes-output');
        const conversionDisplay = document.getElementById('conversion-display');
        const rateDisplay = document.getElementById('rate-display');

        if (!eurInput || !kesOutput) return;

        const eurAmount = parseFloat(eurInput.value) || 0;
        const kesAmount = this.calculate('EUR', 'KES', eurAmount);
        const rate = this.calculate('EUR', 'KES', 1);

        kesOutput.value = eurAmount > 0 ? this.formatAmount(kesAmount) : '';
        
        if (rateDisplay) {
            rateDisplay.textContent = this.formatAmount(rate);
        }

        if (conversionDisplay) {
            conversionDisplay.innerHTML = `1 EUR = ${this.formatAmount(rate)} KES`;
        }

        // Update conversion table
        this.updateConversionTable('EUR', 'KES');
    }

    convertGBPToKES() {
        const gbpInput = document.getElementById('gbp-input');
        const kesOutput = document.getElementById('kes-output');
        const conversionDisplay = document.getElementById('conversion-display');
        const rateDisplay = document.getElementById('rate-display');

        if (!gbpInput || !kesOutput) return;

        const gbpAmount = parseFloat(gbpInput.value) || 0;
        const kesAmount = this.calculate('GBP', 'KES', gbpAmount);
        const rate = this.calculate('GBP', 'KES', 1);

        kesOutput.value = gbpAmount > 0 ? this.formatAmount(kesAmount) : '';
        
        if (rateDisplay) {
            rateDisplay.textContent = this.formatAmount(rate);
        }

        if (conversionDisplay) {
            conversionDisplay.innerHTML = `1 GBP = ${this.formatAmount(rate)} KES`;
        }

        // Update conversion table
        this.updateConversionTable('GBP', 'KES');
    }

    updateConversionTable(fromCurrency, toCurrency) {
        const table = document.getElementById('conversion-table');
        if (!table) return;

        const amounts = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
        
        table.innerHTML = amounts.map(amount => {
            const converted = this.calculate(fromCurrency, toCurrency, amount);
            return `
                <tr class="border-b border-gray-100">
                    <td class="px-4 py-3 text-gray-900">${this.formatAmount(amount)} ${fromCurrency}</td>
                    <td class="px-4 py-3 text-gray-900">${this.formatAmount(converted)} ${toCurrency}</td>
                </tr>
            `;
        }).join('');
    }

    swapCurrencies() {
        const fromCurrency = document.getElementById('from-currency');
        const toCurrency = document.getElementById('to-currency');

        if (!fromCurrency || !toCurrency) return;

        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;

        this.convertCurrency();
    }

    calculate(from, to, amount) {
        if (!this.rates[from] || !this.rates[to]) return 0;
        
        // Convert to USD first, then to target currency
        const usdAmount = amount / this.rates[from];
        return usdAmount * this.rates[to];
    }

    formatAmount(amount) {
        if (amount < 1) {
            return amount.toFixed(4);
        } else if (amount < 100) {
            return amount.toFixed(2);
        } else {
            return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }
    }

    updateUI() {
        // Update current rates display
        const currentRate = document.getElementById('current-rate');
        if (currentRate && this.rates.KES) {
            currentRate.textContent = this.formatAmount(this.rates.KES);
        }

        // Update last updated timestamp
        const lastUpdatedElements = document.querySelectorAll('#last-updated');
        lastUpdatedElements.forEach(element => {
            if (this.lastUpdated) {
                element.textContent = this.lastUpdated.toLocaleString();
            }
        });

        // Update individual rate displays
        this.updateRateDisplays();
        
        // Update rates table
        this.updateRatesTable();

        // Update FAQ rates
        this.updateFAQRates();

        // Trigger initial conversions
        this.convertCurrency();
        this.convertUSDToKES();
        this.convertEURToKES();
        this.convertGBPToKES();
    }

    updateRateDisplays() {
        // USD to KES
        const usdKesElements = document.querySelectorAll('#usd-kes-rate');
        usdKesElements.forEach(element => {
            element.textContent = this.formatAmount(this.rates.KES || 0);
        });

        // EUR to KES
        const eurKesElements = document.querySelectorAll('#eur-kes-rate');
        eurKesElements.forEach(element => {
            const rate = this.calculate('EUR', 'KES', 1);
            element.textContent = this.formatAmount(rate);
        });

        // GBP to KES
        const gbpKesElements = document.querySelectorAll('#gbp-kes-rate');
        gbpKesElements.forEach(element => {
            const rate = this.calculate('GBP', 'KES', 1);
            element.textContent = this.formatAmount(rate);
        });
    }

    updateRatesTable() {
        const ratesTable = document.getElementById('rates-table');
        if (!ratesTable) return;

        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
        
        ratesTable.innerHTML = currencies.map(currency => {
            const rate = this.calculate(currency, 'KES', 1);
            const change = Math.random() * 2 - 1; // Mock change percentage
            const changeClass = change >= 0 ? 'text-green-600' : 'text-red-600';
            const changeSymbol = change >= 0 ? '+' : '';
            
            return `
                <tr class="border-b border-gray-100">
                    <td class="px-4 py-3 text-gray-900">${currency}</td>
                    <td class="px-4 py-3 text-gray-900">${this.formatAmount(rate)}</td>
                    <td class="px-4 py-3 ${changeClass}">${changeSymbol}${change.toFixed(2)}%</td>
                </tr>
            `;
        }).join('');
    }

    updateFAQRates() {
        // Update FAQ rate displays
        const faqRateElement = document.getElementById('faq-rate');
        if (faqRateElement) {
            const page = document.location.pathname;
            let rate = 0;
            
            if (page.includes('usd-to-kes')) {
                rate = this.rates.KES || 0;
            } else if (page.includes('eur-to-kes')) {
                rate = this.calculate('EUR', 'KES', 1);
            } else if (page.includes('gbp-to-kes')) {
                rate = this.calculate('GBP', 'KES', 1);
            }
            
            faqRateElement.textContent = this.formatAmount(rate);
        }

        // Update 100 unit conversions
        const hundredElements = {
            'hundred-usd-kes': () => this.calculate('USD', 'KES', 100),
            'hundred-eur-kes': () => this.calculate('EUR', 'KES', 100),
            'hundred-gbp-kes': () => this.calculate('GBP', 'KES', 100)
        };

        Object.entries(hundredElements).forEach(([id, calcFunc]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.formatAmount(calcFunc());
            }
        });
    }
}

// Initialize the currency converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});

// Refresh rates every 5 minutes
setInterval(() => {
    const converter = new CurrencyConverter();
}, 300000);
