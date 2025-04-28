export default function Stats() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">93%</p>
            <p className="mt-2 text-lg text-gray-600">Improved ATS Score</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">2.5x</p>
            <p className="mt-2 text-lg text-gray-600">More Interview Invitations</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">10K+</p>
            <p className="mt-2 text-lg text-gray-600">Job Seekers Helped</p>
          </div>
        </div>
      </div>
    </section>
  );
}
