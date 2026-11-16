'use client';

import { useRouter } from 'next/navigation';

import { MessageSquareQuote, Images, ArrowRight, Star, ShieldCheck } from 'lucide-react';

import PageHeader from '@/components/shared/PageHeader';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

export default function TestimonialsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Manage customer reviews, ratings, and project proofs." />

      <section className="grid gap-5 md:grid-cols-2">
        {/* CUSTOMER REVIEWS */}
        <Card className="group transition-all duration-300 hover:border-primary/40 hover:shadow-md">
          <CardHeader>
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquareQuote className="size-6" />
            </div>

            <CardTitle>Customer Reviews</CardTitle>

            <CardDescription>Manage customer feedback, ratings, and written testimonials displayed on your website.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                Customer Rating
              </div>

              <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">Written Reviews</div>
            </div>

            <Button className="w-full" onClick={() => router.push('/admin/testimonials/reviews')}>
              Manage Reviews
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>

        {/* CUSTOMER PROOFS */}
        <Card className="group transition-all duration-300 hover:border-primary/40 hover:shadow-md">
          <CardHeader>
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Images className="size-6" />
            </div>

            <CardTitle>Customer Proofs</CardTitle>

            <CardDescription>Upload and manage customer chat screenshots, payment confirmations, and completed project evidence.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">Chat Screenshots</div>

              <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">Payment Proofs</div>
            </div>

            <Button className="w-full" onClick={() => router.push('/admin/testimonials/proofs')}>
              Manage Proofs
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* INFORMATION */}
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

          <div className="space-y-1">
            <p className="text-sm font-medium">Build Customer Trust</p>

            <p className="text-sm text-muted-foreground">Customer Reviews display feedback and ratings, while Customer Proofs showcase real project interactions and transaction evidence. Both can be managed independently.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
