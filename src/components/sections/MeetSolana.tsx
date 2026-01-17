import { motion } from 'framer-motion';

const events = [
  {
    title: 'BREAK POINT',
    number: '26',
    location: 'Abu Dhabi August 26-28',
    tag: 'Register',
    tagSecondary: 'Agenda',
    gradient: 'from-purple-600 to-blue-500',
  },
  {
    title: 'BREAK POINT',
    number: '26',
    location: 'Amsterdam June 26-28',
    tag: 'Register',
    tagSecondary: 'Agenda',
    gradient: 'from-blue-600 to-cyan-400',
  },
];

export default function MeetSolana() {
  return (
    <section className="py-24 bg-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-background mb-2">
            Meet Solana IRL.
          </h2>
          <p className="text-muted text-lg">Build connections.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${event.gradient} rounded-2xl p-8 relative overflow-hidden group cursor-pointer`}
            >
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black text-foreground tracking-tight">
                    {event.title}
                  </span>
                </div>
                <div className="text-8xl font-black text-foreground/90 leading-none mb-6">
                  {event.number}
                </div>
                <p className="text-foreground/80 text-sm mb-4">{event.location}</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-background/20 rounded-full text-foreground text-sm backdrop-blur-sm">
                    {event.tag}
                  </span>
                  <span className="px-3 py-1 bg-background/20 rounded-full text-foreground text-sm backdrop-blur-sm">
                    {event.tagSecondary}
                  </span>
                </div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-foreground/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
