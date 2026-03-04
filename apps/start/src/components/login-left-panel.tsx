import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SellingPoint } from './selling-points';

const sellingPoints = [
  {
    key: 'welcome',
    render: () => (
      <SellingPoint
        bgImage="/img-1.webp"
        title="ZYNIQ Cloud Analytics"
        description="Enterprise-grade web analytics built by ZYNIQ Solutions. Fast, private, and fully self-hosted."
      />
    ),
  },
  {
    key: 'selling-point-2',
    render: () => (
      <SellingPoint
        bgImage="/img-2.webp"
        title="Real-Time Intelligence"
        description="Never miss a beat with sub-second analytics powered by ClickHouse and ZYNIQ's event pipeline."
      />
    ),
  },
  {
    key: 'selling-point-3',
    render: () => (
      <SellingPoint
        bgImage="/img-3.webp"
        title="Simple & Powerful"
        description="Beautiful dashboards, intuitive reports, and AI-assisted insights — analytics that just works."
      />
    ),
  },
  {
    key: 'selling-point-4',
    render: () => (
      <SellingPoint
        bgImage="/img-4.webp"
        title="Privacy by Default"
        description="Your data stays on your infrastructure. GDPR-compliant, no third-party tracking, ever."
      />
    ),
  },
  {
    key: 'selling-point-5',
    render: () => (
      <SellingPoint
        bgImage="/img-5.webp"
        title="Part of ZYNIQ Cloud"
        description="Seamlessly integrated with the ZYNIQ Studio ecosystem — SSO, Brain AI, and the full agent fleet."
      />
    ),
  },
];

export function LoginLeftPanel() {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="flex items-center justify-center h-full mt-24">
        <Carousel
          className="w-full h-full [&>div]:h-full [&>div]:min-h-full"
          opts={{
            loop: true,
            align: 'center',
          }}
        >
          <CarouselContent className="h-full">
            {sellingPoints.map((point) => (
              <CarouselItem
                key={`selling-point-${point.key}`}
                className="p-8 pb-32 pt-0"
              >
                <div className="rounded-xl min-h-full h-full overflow-hidden bg-card border border-border shadow-lg">
                  {point.render()}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-12 bottom-30 top-auto" />
          <CarouselNext className="right-12 bottom-30 top-auto" />
        </Carousel>
      </div>
    </div>
  );
}
