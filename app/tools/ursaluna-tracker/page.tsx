import { Card, CardContent } from "@/components/ui/card"

export default function UrsalunaTrackerPage() {
  const fullMoonData = [
    { year: 2025, month: "November", date: "Wednesday, November 5, 2025", time: "13:18 UTC" },
    { year: 2025, month: "December", date: "Thursday, December 4, 2025", time: "23:13 UTC" },
    { year: 2026, month: "January", date: "Saturday, January 3, 2026", time: "10:03 UTC" },
    { year: 2026, month: "February", date: "Sunday, February 1, 2026", time: "22:10 UTC" },
    { year: 2026, month: "March", date: "Tuesday, March 3, 2026", time: "11:37 UTC" },
    { year: 2026, month: "April", date: "Thursday, April 2, 2026", time: "02:10 UTC" },
    { year: 2026, month: "May", date: "Friday, May 1, 2026", time: "17:23 UTC" },
    { year: 2026, month: "May", date: "Sunday, May 31, 2026", time: "08:45 UTC" },
    { year: 2026, month: "June", date: "Monday, June 29, 2026", time: "23:56 UTC" },
    { year: 2026, month: "July", date: "Wednesday, July 29, 2026", time: "14:35 UTC" },
    { year: 2026, month: "August", date: "Friday, August 28, 2026", time: "04:18 UTC" },
    { year: 2026, month: "September", date: "Saturday, September 26, 2026", time: "16:49 UTC" },
    { year: 2026, month: "October", date: "Monday, October 26, 2026", time: "04:11 UTC" },
    { year: 2026, month: "November", date: "Tuesday, November 24, 2026", time: "14:53 UTC" },
    { year: 2026, month: "December", date: "Thursday, December 24, 2026", time: "01:27 UTC" },
    { year: 2027, month: "January", date: "Friday, January 22, 2027", time: "12:17 UTC" },
    { year: 2027, month: "February", date: "Saturday, February 20, 2027", time: "23:24 UTC" },
    { year: 2027, month: "March", date: "Monday, March 22, 2027", time: "10:42 UTC" },
    { year: 2027, month: "April", date: "Tuesday, April 20, 2027", time: "22:25 UTC" },
    { year: 2027, month: "May", date: "Thursday, May 20, 2027", time: "10:59 UTC" },
    { year: 2027, month: "June", date: "Saturday, June 19, 2027", time: "24:44 UTC" },
    { year: 2027, month: "July", date: "Sunday, July 18, 2027", time: "15:44 UTC" },
    { year: 2027, month: "August", date: "Tuesday, August 17, 2027", time: "07:28 UTC" },
    { year: 2027, month: "September", date: "Wednesday, September 15, 2027", time: "23:03 UTC" },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-8 md:p-12 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Pokémon GO Ursaluna Full Moon Tracker
              </h1>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                Full moons are the only time you can evolve Ursaring into Ursaluna. Use this tracker to schedule
                evolution windows. Since timezones can be tricky, all times are listed in UTC. In order to evolve
                Ursaluna, you must do so during the full moon window and the in-game night cycle has to be active. This
                page uses Meeus-based lunar phase calculations to forecast the next 12 full moons with sub-hour
                precision. It can be used worldwide, but remember to convert UTC to your local time.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Projected Full Moon Windows</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Each timestamp reflects the predicted full moon peak in UTC. Convert it locally and jump in-game
                  during that nighttime window to evolve Ursaring into Ursaluna.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Year</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Month</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Full Moon Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Peak Time (UTC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fullMoonData.map((moon, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 text-foreground">{moon.year}</td>
                          <td className="py-3 px-4 text-foreground">{moon.month}</td>
                          <td className="py-3 px-4 text-foreground">
                            <span className="inline-flex items-center gap-2">
                              <span className="text-lg">🌕</span>
                              {moon.date}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground">{moon.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
