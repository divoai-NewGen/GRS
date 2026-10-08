import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewClient } from "./ReviewClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const card = await prisma.card.findUnique({
    where: { publicToken: token },
    include: { business: true },
  });

  if (!card || !card.business) {
    return {
      title: "Review Business",
    };
  }

  return {
    title: `Review ${card.business.name} | Google Reviews`,
    description: `Share your experience with ${card.business.name}. Quick & easy reviews on Google.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const card = await prisma.card.findUnique({
    where: { publicToken: token },
    include: { business: true },
  });

  if (!card) {
    redirect("/r/status?reason=not_found");
  }

  if (card.status === "DISABLED") {
    redirect("/r/status?reason=disabled");
  }

  if (!card.business || card.status === "UNASSIGNED") {
    redirect("/r/status?reason=unassigned");
  }

  if (card.business.status !== "ACTIVE") {
    redirect("/r/status?reason=business_inactive");
  }

  // Parse custom tags & recommended reviews if stored
  let parsedTags: string[] = [];
  try {
    if (card.business.customTags) {
      parsedTags = JSON.parse(card.business.customTags);
    }
  } catch {
    parsedTags = [];
  }

  let parsedReviews: string[] = [];
  try {
    if (card.business.recommendedReviews) {
      parsedReviews = JSON.parse(card.business.recommendedReviews);
    }
  } catch {
    parsedReviews = [];
  }

  return (
    <ReviewClient
      cardId={card.id}
      cardCode={card.cardCode}
      publicToken={card.publicToken}
      business={{
        id: card.business.id,
        name: card.business.name,
        slug: card.business.slug,
        businessType: card.business.businessType,
        description: card.business.description,
        logoUrl: card.business.logoUrl,
        googleBusinessName: card.business.googleBusinessName,
        googleReviewUrl: card.business.googleReviewUrl,
        planType: card.business.planType,
        negativeFeedbackFilter: card.business.negativeFeedbackFilter,
        customTags: parsedTags,
        recommendedReviews: parsedReviews,
      }}
    />
  );
}
