import { motion } from 'framer-motion';

const logos = ['Circlepay', 'VISA', 'PayPal', 'Shopify'];

const institutionStats = [
  { company: 'Circle', stat: 'USD₮', label: 'Native on Solana', value: '' },
  { company: 'Visa', stat: 'MILLIONS', label: 'Settled on Solana', value: '' },
  { company: 'PayPal', stat: 'PYUSD', label: 'Native on Solana', value: '' },
  { company: 'Shopify', stat: '64%', label: 'Lower fees', value: '' },
];

const moreInstitutions = [
  { name: 'Stripe', stat: '10B', label: 'Transactions processed' },
  { name: 'Worldpay', stat: '2.5B', label: 'Users reached' },
  { name: 'Franklin', stat: '2.5B', label: 'AUM on Solana' },
];

export default function Institutions() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The world's largest institutions<br />
            and fintechs are building on<br />
            <span className="text-gradient">Solana.</span>
          </h2>
        </motion.div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-8 items-center mb-16"
        >
          {logos.map((logo) => (
            <div key={logo} className="text-muted-foreground font-semibold text-xl">
              {logo}
            </div>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {institutionStats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-gradient rounded-xl p-6 bg-gradient-card"
            >
              <div className="text-2xl font-bold text-foreground mb-1">
                {item.stat}
              </div>
              <div className="text-muted-foreground text-sm">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* More Institutions */}
        <div className="grid md:grid-cols-3 gap-6">
          {moreInstitutions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">{item.name[0]}</span>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{item.stat}</div>
                <div className="text-muted-foreground text-sm">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
