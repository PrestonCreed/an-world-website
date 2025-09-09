// emails/ANLayout.tsx
import * as React from 'react';

const palette = {
  bg: '#000000',
  fg: '#FFFFFF',
  blue: '#0f7edd', // core glow
  blueMid: '#073991',
  blueDark: '#021647',
  red: '#FF0000',
  muted: 'rgba(255,255,255,0.72)',
  border: 'rgba(255,255,255,0.12)',
};

export default function ANLayout({
  previewText,
  title,
  children,
}: {
  previewText?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const fontStack =
    '"Suisse Int\\’l", "Suisse Intl", "Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{title || 'AN World'}</title>
        {/* mobile scaling */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {previewText ? (
          <meta name="x-preview-text" content={previewText} />
        ) : null}
      </head>
      <body style={{ margin: 0, padding: 0, background: palette.bg, color: palette.fg }}>
        {/* Outer wrapper */}
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ background: palette.bg }}
        >
          <tbody>
            <tr>
              <td>
                {/* Container */}
                <table
                  role="presentation"
                  width={600}
                  align="center"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    width: 600,
                    margin: '24px auto',
                    background:
                      'linear-gradient(180deg, rgba(2,22,71,0.35) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 100%)',
                    border: `1px solid ${palette.border}`,
                    borderRadius: 16,
                    boxShadow: `0 0 24px ${palette.blue}55`,
                    fontFamily: fontStack,
                  }}
                >
                  {/* Header */}
                  <tbody>
                    <tr>
                      <td style={{ padding: '20px 24px', borderBottom: `1px solid ${palette.border}` }}>
                        <table role="presentation" width="100%">
                          <tbody>
                            <tr>
                              <td style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
                                AN<span style={{ color: palette.red }}> world</span>
                              </td>
                              <td style={{ textAlign: 'right', fontSize: 12, opacity: 0.7 }}>
                                {title || 'AN World'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Content */}
                    <tr>
                      <td style={{ padding: 24 }}>{children}</td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: '18px 24px',
                          borderTop: `1px solid ${palette.border}`,
                          fontSize: 12,
                          color: palette.muted,
                        }}
                      >
                        © {new Date().getFullYear()} AN World. All rights reserved.
                        <div style={{ height: 8 }} />
                        <div>
                          AN brand core: black/white with portal blue glow accents (see brand guide).{/*  */}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Subtle portal glow under card */}
                <div
                  style={{
                    width: 600,
                    margin: '0 auto 36px auto',
                    height: 10,
                    background: `radial-gradient(60% 100% at 50% 0%, ${palette.blue}55, transparent 70%)`,
                    filter: 'blur(6px)',
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
