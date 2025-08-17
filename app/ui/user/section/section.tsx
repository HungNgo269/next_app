import { BookOpen, Download, Users } from "lucide-react";

export default function SectionComponent() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose NextBook?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Offline Reading</h3>
            <p className="text-muted-foreground">
              Download books and read them anywhere, even without internet
              connection.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Clubs</h3>
            <p className="text-muted-foreground">
              Join reading communities and discuss your favorite books with
              fellow readers.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized</h3>
            <p className="text-muted-foreground">
              Get book recommendations tailored to your reading preferences and
              history.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
