import { motion } from 'framer-motion';

const events = [
  {
    title: 'BREAK POINT',
    number: '26',
    location: 'Abu Dhabi • August 26–28',
    tag: 'Register',
    tagSecondary: 'Agenda',
    gradient: 'from-purple-600 to-blue-500',
  },
  {
    title: 'BREAK POINT',
    number: '26',
    location: 'Amsterdam • June 26–28',
    tag: 'Register',
    tagSecondary: 'Agenda',
    gradient: 'from-blue-600 to-cyan-400',
  },
];

export default function MeetSolana() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">
            Meet Solana IRL.
          </h2>
          <p className="text-white/60 text-lg">
            Build connections.
          </p>
        </motion.div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer group 
                bg-gradient-to-br ${event.gradient}`}
            >
              <div className="relative z-10">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black tracking-tight text-white">
                    {event.title}
                  </span>
                </div>

                <div className="text-8xl font-black leading-none mb-6 text-white/90">
                  {event.number}
                </div>

                <p className="text-white/70 text-sm mb-4">
                  {event.location}
                </p>

                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-sm text-white bg-black/30 backdrop-blur-sm border border-white/10">
                    {event.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm text-white bg-black/30 backdrop-blur-sm border border-white/10">
                    {event.tagSecondary}
                  </span>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
