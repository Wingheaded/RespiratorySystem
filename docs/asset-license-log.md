# Asset License Log

Track every external asset shipped in the app: filename, source URL, license, attribution string required, and download date. Update this on every asset added.

For this first version, the 3D anatomical assets in `Assets/` were generated with AI for this project by Jose Antonio Luanda. They do not require third-party attribution or external license tracking.

| Filename | Type | Source URL | License | Attribution Required | Commercial Use OK | Added On | Notes |
|----------|------|------------|---------|----------------------|-------------------|----------|-------|
| RespiratorySystem.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Main respiratory model asset |
| nasalCavity.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| Pharynx.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| larynx.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| Trachea.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| MainBronchi.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| Bronchioles.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| Alvioli.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Filename kept as provided |
| RightLung.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| LeftLung.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Used as selectable structure |
| Dyaphragm.glb | 3D model | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Filename kept as provided |
| video.mp4 | Video | N/A - provided project asset | Project asset | No | Yes | 2026-05-14 | Used in the real-world context panel |
| RespiratorySystem02.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Main atlas-style anatomy plate |
| NasalCavity.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Structure reference image |
| Pharynx.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Structure reference image |
| MainBronchi.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Structure reference image |
| Bronchioles.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Structure reference image |
| Alvioli.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Filename kept as provided |
| RightLung.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Structure reference image |
| LeftLung.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Structure reference image |
| Dyaphragm.png | Anatomy image | N/A - AI-generated project asset | Project-owned AI-generated asset | No | Yes | 2026-05-14 | Filename kept as provided |

## License legend

- **Project-owned AI-generated asset**: generated for this project, no third-party attribution required.
- **CC0 / Public Domain**: any use, no attribution required.
- **CC-BY**: any use including commercial, attribution required.
- **CC-BY-SA**: any use including commercial, attribution required, derivatives must use same license.
- **CC-BY-NC / CC-BY-NC-SA**: non-commercial only; do not ship in a product that may be sold.

## Verification ritual at release

- [ ] Every non-project-owned asset has a source URL and license.
- [ ] Every CC-BY / CC-BY-SA asset has an attribution line in `/creditos`.
- [ ] No row has license "Unknown" or "TBD".
- [ ] No shipped asset has a non-commercial license.
- [ ] Asset files in `public/` exactly match this list, or the list is updated before release.
