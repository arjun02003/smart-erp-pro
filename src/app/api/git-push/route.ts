import { exec } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST() {
  return new Promise((resolve) => {
    // Run the batch file natively on the host machine
    exec('cmd.exe /c "c:\\Users\\ARJUN\\OneDrive\\Desktop\\bus-alert-app\\push_to_github.bat"', (error, stdout, stderr) => {
      if (error) {
        console.error('Git push error:', error);
        resolve(
          NextResponse.json(
            { success: false, error: error.message, stderr },
            { status: 500 }
          )
        );
      } else {
        console.log('Git push success:', stdout);
        resolve(NextResponse.json({ success: true, stdout }));
      }
    });
  });
}
