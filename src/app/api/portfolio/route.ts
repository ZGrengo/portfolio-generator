import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import connectDB from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.sub;
    await connectDB();

    const portfolios = await Portfolio.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ portfolios });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.sub;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = new Portfolio({
      userId,
      title: body.title,
      description: body.description,
      template: body.template || 'minimalistic',
      colors: body.colors || {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        highlight: '#F59E0B',
      },
      projects: body.projects || [],
      skills: body.skills || [],
      education: body.education || [],
      experience: body.experience || [],
    });

    const savedPortfolio = await portfolio.save();

    return NextResponse.json(
      { portfolio: savedPortfolio },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.sub;
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = await Portfolio.findOne({ _id: body.id, userId });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (body.title !== undefined) portfolio.title = body.title;
    if (body.description !== undefined) portfolio.description = body.description;
    if (body.template !== undefined) portfolio.template = body.template;
    if (body.colors !== undefined) portfolio.colors = body.colors;
    if (body.projects !== undefined) portfolio.projects = body.projects;
    if (body.skills !== undefined) portfolio.skills = body.skills;
    if (body.education !== undefined) portfolio.education = body.education;
    if (body.experience !== undefined) portfolio.experience = body.experience;

    const updatedPortfolio = await portfolio.save();

    return NextResponse.json({ portfolio: updatedPortfolio });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.sub;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = await Portfolio.findOneAndDelete({ _id: id, userId });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

