# Visual Right Authentication System Documentation

This document provides comprehensive instructions for using and extending the authentication system in the Visual Right application.

## Overview

Visual Right uses a context-based authentication system with NextAuth.js integration capabilities, allowing for role-based access control to premium and administrative features. The system is designed to be user-friendly while providing clear indications of premium feature availability.

## Core Components

### Authentication Context

The `AuthContext` provides the foundation of the authentication system:

```tsx
import { useAuth } from '@/context/AuthContext';

// Access auth features in any component
const { user, status, login, logout } = useAuth();
```

#### Available Properties:

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user object or null if not authenticated |
| `status` | `"loading" \| "authenticated" \| "unauthenticated"` | Current authentication state |
| `login` | `(username: string, password: string) => Promise<boolean>` | Login function |
| `logout` | `() => void` | Logout function |

### Premium Feature Protection

#### WithPremiumFeature Component

This component wraps UI elements that require authentication to access:

```tsx
import { WithPremiumFeature } from '@/components/auth/withPremiumFeature';

<WithPremiumFeature 
  featureName="AI Object Detection"
  description="Our advanced computer vision AI can identify objects in your images."
>
  <Button onClick={detectObjects}>Detect Objects</Button>
</WithPremiumFeature>
```

#### Props:

| Prop | Type | Description |
|------|------|-------------|
| `featureName` | `string` | Name of the premium feature |
| `description` | `string` | Explanation of the feature and why it requires authentication |
| `showLockIcon` | `boolean` | Whether to show a lock icon overlay (default: `true`) |
| `children` | `ReactElement` | The UI element to protect |
| `className` | `string` | Additional CSS classes |

#### Higher-Order Component

For protecting entire components:

```tsx
import { withPremiumFeature } from '@/components/auth/withPremiumFeature';

// Create a protected version of your component
const ProtectedComponent = withPremiumFeature(YourComponent, {
  featureName: "Feature Name",
  description: "Description text"
});
```

### Premium Feature Modal

This modal appears when users attempt to access premium features without being authenticated:

```tsx
import { PremiumFeatureModal } from '@/components/auth/PremiumFeatureModal';

<PremiumFeatureModal
  open={showModal}
  onClose={() => setShowModal(false)}
  featureName="Feature Name"
  description="Why this feature requires authentication"
/>
```

### Authentication Modal

The `AuthModal` component handles the login and registration process:

```tsx
import AuthModal from '@/components/common/top_dropdown_tree/AuthModal';

<AuthModal
  open={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  onLogin={handleLogin}
  onRegister={handleRegister}
  mode="login" // or "register"
/>
```

## User Roles and Permissions

The system supports three user roles:

- `"user"`: Basic authenticated access
- `"premium"`: Access to premium features
- `"admin"`: Administrative privileges

Check for roles in your components:

```tsx
const { user } = useAuth();

// Check if user has admin role
const isAdmin = user?.role === "admin";

// Conditional rendering based on role
{isAdmin && <AdminControls />}
```

## Integration Examples

### Protecting Node Operations

```tsx
// Inside a flow node component
<WithPremiumFeature 
  featureName="AI Object Detection"
  description="Our advanced computer vision AI identifies objects in your images."
>
  <Button 
    onClick={performObjectDetection} 
    disabled={isProcessing}
    className="text-xs h-7"
  >
    {isProcessing ? 'Analyzing...' : 'Detect Objects'}
  </Button>
</WithPremiumFeature>
```

### Protecting Routes

```tsx
// Inside a page component
export default function ProtectedPage() {
  const { status } = useAuth();
  
  // Show loading state
  if (status === "loading") {
    return <LoadingSpinner />;
  }
  
  // Redirect unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">Please sign in to access this page.</p>
        <AuthModal 
          open={true} 
          onClose={() => window.location.href = "/"} 
          mode="login"
        />
      </div>
    );
  }
  
  // Show protected content
  return (
    <YourProtectedContent />
  );
}
```

## Testing Authentication

During development and testing, the system is configured to accept any credentials:

```tsx
// In AuthContext.tsx
// For demo purposes when NextAuth is not fully set up
const demoLogin = async (email: string, password: string): Promise<boolean> => {
  // Currently accepts any input (for development only)
  if (true || (email === "demo@example.com" && password === "password")) {
    setUser({
      id: "demo-user-id",
      name: "Demo User",
      email: email,
      role: "premium" // or "user" or "admin"
    });
    setStatus("authenticated");
    return true;
  }
  return false;
};
```

## Future Integration with NextAuth.js

The authentication system is designed to be easily integrated with NextAuth.js in the future:

```tsx
// Future implementation with NextAuth.js
import { useSession, signIn, signOut } from "next-auth/react";

// Within AuthProvider component
const { data: session, status: nextAuthStatus } = useSession();

useEffect(() => {
  if (nextAuthStatus === "authenticated" && session?.user) {
    setUser({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role || "user",
      avatarUrl: session.user.image
    });
    setStatus("authenticated");
  } else if (nextAuthStatus === "unauthenticated") {
    setUser(null);
    setStatus("unauthenticated");
  } else {
    setStatus("loading");
  }
}, [nextAuthStatus, session]);
```

## Best Practices

1. **Consistent UI**: Use the provided authentication components consistently throughout the application for a unified user experience.

2. **Clear Messaging**: Always provide clear descriptions of why features require authentication, focusing on the benefits to the user.

3. **Graceful Fallbacks**: Provide meaningful alternatives or clear instructions when users encounter protected features.

4. **Visual Indicators**: Use the lock and crown icons consistently to indicate premium features before users interact with them.

5. **Role-Based UI**: Adapt the UI based on user roles, showing or hiding features rather than displaying error messages after interaction.

## Troubleshooting

### Auth Context Not Available

If you encounter errors about `useAuth` being undefined:

1. Ensure your component is within the `AuthProvider` in the component tree.
2. Check that you've imported `useAuth` correctly: `import { useAuth } from '@/context/AuthContext';`

### Premium Modal Not Appearing

If the premium feature modal doesn't appear when clicking protected elements:

1. Verify that `WithPremiumFeature` is properly wrapping your component.
2. Check that the click handler isn't stopping propagation before the authentication check.

### Authentication State Not Updating

If login/logout doesn't appear to change the application state:

1. Verify that you're using the `login`/`logout` functions from `useAuth()`.
2. Check for any errors in the console during the authentication process.
3. Ensure you're checking both `status === "authenticated"` and `user !== null` for conditional rendering.
