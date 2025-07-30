# Justice Half Marathon 2025 - Confirmation Website

A modern, responsive website for runners to confirm and edit their registration details for the Justice Half Marathon 2025, organized by the Army IBA Hiking & Trekking Club, Sylhet, Bangladesh.

## Features

### 🏃‍♂️ Runner Features
- **Registration Verification**: Verify registration using phone number or transaction ID
- **Data Confirmation**: Confirm registration details with one click
- **Edit Capability**: Update full name and T-shirt size
- **Real-time Status**: View confirmation status and category
- **Multilingual Support**: English and Bangla interface
- **Event Countdown**: Live countdown to race day
- **Event Guide**: Interactive event guide with downloadable PDF
- **Race Day Checklist**: Interactive checklist with progress tracking

### 👨‍💼 Admin Features
- **Secure Login**: Supabase authentication for organizers
- **Runner Management**: View, filter, and search all runners
- **Real-time Statistics**: Track confirmed vs pending registrations
- **CSV Export**: Export filtered data for BIB creation
- **Activity Logging**: All admin actions logged in database

### 🔧 Technical Features
- **Google Sheets Integration**: Real-time data sync via Google Apps Script
- **Supabase Backend**: Secure database for logging and authentication
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: High contrast, ARIA labels, keyboard navigation
- **Modern UI**: Tailwind CSS with custom design system

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Data Source**: Google Sheets via Google Apps Script
- **Deployment**: Lovable (can be deployed to Vercel, Netlify, etc.)
- **UI Components**: shadcn/ui with custom design system

## Database Schema

### Supabase Tables

#### `confirmations`
```sql
- id: UUID (Primary Key)
- phone: TEXT (Runner's phone number)
- status: TEXT (confirmation status)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `edits`
```sql
- id: UUID (Primary Key)
- phone: TEXT (Runner's phone number)
- old_name: TEXT (Previous name)
- new_name: TEXT (Updated name)
- old_tshirt: TEXT (Previous T-shirt size)
- new_tshirt: TEXT (Updated T-shirt size)
- created_at: TIMESTAMP
```

#### `admin_actions`
```sql
- id: UUID (Primary Key)
- admin_id: UUID (Admin user ID)
- action: TEXT (Action description)
- details: JSONB (Action details)
- created_at: TIMESTAMP
```

#### `profiles`
```sql
- id: UUID (Primary Key)
- user_id: UUID (References auth.users)
- display_name: TEXT
- email: TEXT
- role: TEXT (default: 'admin')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Google Sheets Structure

| Column | Description | Example |
|--------|-------------|---------|
| Full Name | Runner's complete name | "John Doe" |
| Email | Contact email | "john@example.com" |
| Phone Number | Primary phone | "+8801712345678" |
| Alternative Phone Number | Secondary phone | "+8801812345678" |
| Date of Birth | Birth date | "1990-01-01" |
| Address | Full address | "Sylhet, Bangladesh" |
| Gender | Male/Female | "Male" |
| T-Shirt Size | Size preference | "L" |
| Accommodation | Yes/No | "No" |
| Category | Race category | "21 KM Half Marathon" |
| Payment Number | bKash/Nagad number | "+8801712345678" |
| Transaction ID | Payment reference | "TX123456" |
| Confirmed | Confirmation status | "Yes"/"No" |

## Setup Instructions

### 1. Google Apps Script Setup

1. **Create Google Sheet**:
   - Create a new Google Sheet with the columns listed above
   - Add sample data for testing

2. **Deploy Google Apps Script**:
   - Open Google Apps Script (script.google.com)
   - Create a new project
   - Copy the code from `src/services/googleSheetsService.ts` (the Google Apps Script section)
   - Save and deploy as a web app:
     - Execute as: Me
     - Who has access: Anyone
   - Copy the deployment URL

3. **Configure Sheet Access**:
   - Ensure the script has access to your Google Sheet
   - Test the endpoints with sample data

### 2. Supabase Setup

1. **Create Supabase Project**:
   - The project is already connected to Supabase
   - Project URL: https://yiclipdmvnetgsttexab.supabase.co

2. **Database Tables**:
   - All required tables are already created
   - Tables include: confirmations, edits, admin_actions, profiles

3. **Set Up Authentication**:
   - Enable email authentication in Supabase dashboard
   - Create admin user accounts for organizers

### 3. Environment Configuration

Create a `.env` file with:

```env
# Google Apps Script Configuration
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Optional Analytics
REACT_APP_GTM_ID=GTM-XXXXXXX
REACT_APP_HOTJAR_ID=1234567
```

### 4. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 5. Deployment

#### Option 1: Lovable Deployment
- Click "Publish" in Lovable interface
- Configure custom domain if needed

#### Option 2: Manual Deployment
- Build the project: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Set environment variables in hosting platform

## User Flows

### Runner Verification Flow
1. Visit website
2. Enter phone number or transaction ID
3. View retrieved registration data
4. Confirm details OR edit name/T-shirt size
5. Receive confirmation message

### Admin Management Flow
1. Navigate to `/admin`
2. Login with admin credentials
3. View runner statistics
4. Filter and search runners
5. Export data as CSV
6. All actions logged automatically

## API Integration

### Google Apps Script Endpoints

**GET**: Fetch runner data
```
GET {SCRIPT_URL}?action=getRunner&search={phone_or_transaction_id}
```

**POST**: Confirm runner
```
POST {SCRIPT_URL}
Content-Type: application/json
{
  "action": "confirmRunner",
  "phone": "+8801712345678"
}
```

**POST**: Update runner details
```
POST {SCRIPT_URL}
Content-Type: application/json
{
  "action": "updateRunner",
  "phone": "+8801712345678",
  "updates": {
    "fullName": "Updated Name",
    "tshirtSize": "XL"
  }
}
```

**GET**: Fetch all runners (admin)
```
GET {SCRIPT_URL}?action=getAllRunners
```

## Security Features

- **Row Level Security**: Enabled on all Supabase tables
- **Authentication Required**: Admin panel requires login
- **Input Validation**: All user inputs sanitized
- **HTTPS Only**: Secure data transmission
- **Audit Logging**: All actions tracked in database

## Event Details

- **Date**: September 26, 2025
- **Time**: 6:00 AM onwards
- **Location**: Sylhet, Bangladesh
- **Organizer**: Army IBA Hiking & Trekking Club

### Race Categories
1. **21 KM Half Marathon**: Main competitive race
2. **10 KM Long Run**: Medium distance race
3. **Student 10K**: Special category for students
4. **Kids 1 KM Fun Run**: Family-friendly short race

### T-Shirt Sizes Available
- Kids: Xs Kids', S Kids', M Kids'
- Adults: XS, S, M, L, XL, XXL, 3XL, 4XL

## Contact Information
- **Phone**: +8801568082587
- **Email**: info@justicehalfmarathon.com
- **Developer**: MD Golam Mubasshir Rafi

---

For technical support or questions, please contact the development team.