const getEnvironmentVariable = (environmentVariable: string): string => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  } else {
    return unvalidatedEnvironmentVariable;
  }
};

export const config = {
  supebaseUrl:getEnvironmentVariable("SUPABASE_URL"),
  supabaseKey:getEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
};