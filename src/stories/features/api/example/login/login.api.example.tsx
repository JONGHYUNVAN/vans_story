import { LoginApiCard } from '../../login.api.card';

export default function LoginApiExample() {
  const sampleData = {
     success: true,
     data: null, 
     message: null,
  };
  return (
    <LoginApiCard
      endpoint="/api/auth/login"
      method="POST"
      body={{ email: 'test@example.com', password: 'Test1234!' }}
      data={sampleData}
      status={200}
      error={null}
      loading={false}
      authHeader="Bearer demo-token"
    />
  );
} 