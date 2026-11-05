$ErrorActionPreference = 'Stop'

function Normalize-PathText {
    param([string]$Text)

    $normalized = $Text.Replace('\', '/')

    [regex]::Replace(
        $normalized,
        '(^|[^A-Za-z])([A-Za-z]):/',
        {
            param($match)
            $match.Groups[1].Value + '/' +
                $match.Groups[2].Value.ToLowerInvariant() + '/'
        }
    )
}

function Get-PayloadStrings {
    param($Value)

    if ($null -eq $Value) {
        return
    }

    if ($Value -is [string]) {
        $Value
    }
    elseif ($Value -is [System.Management.Automation.PSCustomObject]) {
        foreach ($property in $Value.PSObject.Properties) {
            Get-PayloadStrings $property.Value
        }
    }
    elseif ($Value -is [System.Collections.IDictionary]) {
        foreach ($item in $Value.Values) {
            Get-PayloadStrings $item
        }
    }
    elseif ($Value -is [System.Collections.IEnumerable]) {
        foreach ($item in $Value) {
            Get-PayloadStrings $item
        }
    }
}

function Write-Denial {
    param([string]$Reason)

    @{
        permissionDecision       = 'deny'
        permissionDecisionReason = $Reason
    } | ConvertTo-Json -Compress
}

try {
    $payload = [Console]::In.ReadToEnd() | ConvertFrom-Json

    if ($payload -isnot [System.Management.Automation.PSCustomObject]) {
        throw 'Expected a JSON event object.'
    }

    if ([string]::IsNullOrWhiteSpace($payload.toolName)) {
        throw 'Missing toolName in hook event.'
    }

    $repoRoot = [System.IO.Path]::GetFullPath(
        (Join-Path $PSScriptRoot '..\..')
    )
    $policyPath = Join-Path $repoRoot 'policy\protected-paths.txt'

    $strings = @(
        foreach ($property in $payload.PSObject.Properties) {
            if ($property.Name -notin @(
                'cwd', 'workingDirectory', 'timestamp', 'toolName'
            )) {
                Get-PayloadStrings $property.Value
            }
        }
    )

    $text = Normalize-PathText ($strings -join ' ')
    $normalizedRoot = (Normalize-PathText $repoRoot).TrimEnd('/')

    $text = [regex]::Replace(
        $text,
        [regex]::Escape($normalizedRoot + '/'),
        '',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    foreach ($line in Get-Content -LiteralPath $policyPath -Encoding UTF8) {
        if ([string]::IsNullOrWhiteSpace($line) -or
            $line.TrimStart().StartsWith('#')) {
            continue
        }

        if ([regex]::IsMatch($text, $line)) {
            Write-Denial (
                'Blocked by policy/protected-paths.txt. ' +
                'Ask a human (see docs/adr/0001).'
            )
            exit 0
        }
    }
}
catch {
    $reason = 'Protection hook failed: ' + $_.Exception.Message
    [Console]::Error.WriteLine($reason)
    Write-Denial $reason
    exit 0
}

exit 0