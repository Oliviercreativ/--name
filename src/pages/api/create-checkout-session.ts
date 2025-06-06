import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

export const POST: APIRoute = async ({ request }) => {
    try {
        const { priceId } = await request.json();

        // Création de la session de paiement
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${import.meta.env.SITE}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${import.meta.env.SITE}/cancel`,
            customer_email: '', // Optionnel : pré-remplir l'email
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['FR'],
            },
            locale: 'fr',
            payment_intent_data: {
                metadata: {
                    // Ajoutez des métadonnées si nécessaire
                },
            },
        });

        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Erreur Stripe:', error);
        return new Response(JSON.stringify({ error: 'Erreur lors de la création de la session' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}; 