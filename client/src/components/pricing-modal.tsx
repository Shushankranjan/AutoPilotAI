import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface PricingModalProps {
  onClose: () => void;
}

export function PricingModal({ onClose }: PricingModalProps) {
  const pricingTiers = [
    {
      name: 'Free',
      price: '₹0',
      period: '/mo',
      features: [
        '3 plans per day',
        'Basic plan generation',
      ],
      disabledFeatures: [
        'No plan saving',
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      highlight: false,
    },
    {
      name: 'Basic',
      price: '₹99',
      period: '/mo',
      features: [
        'Unlimited plans',
        'Advanced plan generation',
        'Save up to 10 plans',
      ],
      disabledFeatures: [],
      buttonText: 'Choose Basic',
      buttonVariant: 'default' as const,
      highlight: true,
      badge: 'POPULAR'
    },
    {
      name: 'Pro',
      price: '₹249',
      period: '/mo',
      features: [
        'Everything in Basic',
        'Unlimited plan storage',
        'AI goal coaching',
      ],
      disabledFeatures: [],
      buttonText: 'Choose Pro',
      buttonVariant: 'secondary' as const,
      highlight: false,
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upgrade to AutoPilot Pro</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Pricing Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingTiers.map((tier) => (
                <div 
                  key={tier.name}
                  className={`border ${tier.highlight ? 'border-2 border-blue-400' : 'border-gray-200'} rounded-lg p-4 relative ${tier.highlight ? 'shadow-md' : 'hover:shadow-md transition-shadow'} ${tier.highlight && 'bg-white'} ${!tier.highlight && tier.name === 'Pro' ? 'bg-purple-50' : ''}`}
                >
                  {tier.badge && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs py-1 px-2 rounded-bl-lg">
                      {tier.badge}
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-800">{tier.name}</h3>
                  <p className="text-2xl font-bold my-2">
                    {tier.price} <span className="text-sm font-normal text-gray-500">{tier.period}</span>
                  </p>
                  <ul className="text-sm space-y-2 mt-4 text-gray-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {tier.disabledFeatures.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-400">
                        <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                Start Free Trial
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">No credit card required to start</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
